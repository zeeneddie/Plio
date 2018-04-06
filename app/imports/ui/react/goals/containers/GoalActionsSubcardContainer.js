import { pure, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import {
  getUserOptions,
  Cache,
  viewEq,
  lenses,
  toDate,
  mapRejectedEntitiesToOptions,
  bySerialNumber,
} from 'plio-util';
import { ifElse, sort, last, mergeDeepLeft } from 'ramda';
import { FORM_ERROR } from 'final-form';
import moment from 'moment';

import { Query, Mutation, Fragment } from '../../../../client/graphql';
import { client } from '../../../../client/apollo';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { swal } from '../../../../client/util';
import { updateGoalFragment, updateActionFragment } from '../../../../client/apollo/utils';
import {
  ActionPlanOptions,
  UserRoles,
  DocumentTypes,
  ActionTypes,
} from '../../../../share/constants';
import { namedCompose } from '../../helpers';
import GoalActionsSubcard from '../components/GoalActionsSubcard';

const {
  DELETE_ACTION,
  CREATE_ACTION,
  LINK_DOC_TO_ACTION,
  UNLINK_DOC_FROM_ACTION,
} = Mutation;

export default namedCompose('GoalActionsSubcardContainer')(
  pure,
  graphql(Query.GOAL_ACTIONS_CARD, {
    options: ({ goalId, organizationId }) => ({
      variables: { _id: goalId, organizationId },
      fetchPolicy: ApolloFetchPolicies.CACHE_ONLY,
    }),
    props: ({
      data: {
        user: { roles = [], ...user } = {},
        goal: {
          goal: {
            title,
            sequentialId,
            actions = [],
            organization: { _id: organizationId } = {},
          } = {},
        } = {},
      },
    }) => ({
      organizationId,
      actions: sort(bySerialNumber, actions),
      userId: user._id,
      canCompleteAnyAction: roles.includes(UserRoles.COMPLETE_ANY_ACTION),
      linkedTo: {
        title,
        sequentialId,
      },
      initialValues: {
        active: 0,
        owner: getUserOptions(user),
        toBeCompletedBy: getUserOptions(user),
        planInPlace: ActionPlanOptions.NO,
        // TODO: Update based on linked documents like creation modal?
        completionTargetDate: moment(),
      },
    }),
  }),
  graphql(DELETE_ACTION, { name: DELETE_ACTION.name }),
  graphql(CREATE_ACTION, { name: CREATE_ACTION.name }),
  graphql(LINK_DOC_TO_ACTION, { name: LINK_DOC_TO_ACTION.name }),
  graphql(UNLINK_DOC_FROM_ACTION, { name: UNLINK_DOC_FROM_ACTION.name }),
  withHandlers({
    onDelete: ({ [DELETE_ACTION.name]: mutate, goalId }) => (e, { entity: { _id, title } }) =>
      swal.promise({
        text: `The action "${title}" will be deleted`,
        confirmButtonText: 'Delete',
        successTitle: 'Deleted!',
        successText: `The action "${title}" was deleted successfully.`,
      }, () => mutate({
        variables: {
          input: { _id },
        },
        update: updateGoalFragment(Cache.deleteActionById(_id), {
          id: goalId,
          fragment: Fragment.GOAL_CARD,
        }),
      })),
    createAction: ({ organizationId, goalId, [CREATE_ACTION.name]: mutate }) => async (
      {
        title,
        description,
        completionTargetDate,
        planInPlace,
        owner: { value: ownerId },
        toBeCompletedBy: { value: toBeCompletedBy },
      },
      {
        ownProps: { flush },
      },
    ) => {
      if (!title) return { [FORM_ERROR]: 'Title is required' };

      try {
        const { data } = await mutate({
          variables: {
            input: {
              title,
              description,
              ownerId,
              organizationId,
              planInPlace,
              toBeCompletedBy,
              completionTargetDate: toDate(completionTargetDate),
              type: ActionTypes.GENERAL_ACTION,
              linkedTo: [{
                documentId: goalId,
                documentType: DocumentTypes.GOAL,
              }],
            },
          },
          update: (proxy, { data: { [CREATE_ACTION.name]: { action } } }) => updateGoalFragment(
            Cache.addAction(action),
            {
              id: goalId,
              fragment: Fragment.GOAL_CARD,
            },
            proxy,
          ),
        });

        const { [CREATE_ACTION.name]: { action } } = data;

        return flush(action);
      } catch ({ message }) {
        return { [FORM_ERROR]: message };
      }
    },
    linkGoalToAction: ({ goalId, [LINK_DOC_TO_ACTION.name]: mutate }) => async (
      { action: { value: actionId } = {} },
      {
        ownProps: { flush },
      },
    ) => {
      if (!actionId) return { [FORM_ERROR]: 'Action is required' };

      try {
        const { data } = await mutate({
          variables: {
            input: {
              _id: actionId,
              documentId: goalId,
              documentType: DocumentTypes.GOAL,
            },
          },
          update: (proxy, { data: { [LINK_DOC_TO_ACTION.name]: { action } } }) =>
            updateGoalFragment(
              Cache.addAction(action),
              {
                id: goalId,
                fragment: Fragment.GOAL_CARD,
              },
              proxy,
            ),
        });
        const { [LINK_DOC_TO_ACTION.name]: { action } } = data;

        return flush(action);
      } catch ({ message }) {
        return { [FORM_ERROR]: message };
      }
    },
    loadActions: ({ organizationId, actions }) => () => client.query({
      query: Query.ACTION_LIST,
      variables: {
        organizationId,
        type: ActionTypes.GENERAL_ACTION,
      },
    }).then(({ data: { actions: { actions: resultActions } } }) => ({
      options: mapRejectedEntitiesToOptions(actions, resultActions),
    })),
    loadLinkedDocs: ({ organizationId }) => action => client.query({
      query: Query.GOAL_LIST,
      variables: { organizationId },
    }).then(({ data: { goals: { goals } } }) => ({
      options: mapRejectedEntitiesToOptions(action.goals, goals),
    })),
    onLink: ({ [LINK_DOC_TO_ACTION.name]: mutate }) =>
      async (options, { _id, goals }) => options.length > goals.length && mutate({
        variables: {
          input: {
            _id,
            documentId: last(options).value,
            documentType: DocumentTypes.GOAL,
          },
        },
        update: (proxy, { data: { [LINK_DOC_TO_ACTION.name]: { action } } }) =>
          updateActionFragment(
            mergeDeepLeft(action),
            {
              id: _id,
              fragment: Fragment.ACTION_CARD,
            },
            proxy,
          ),
      }),
    onUnlink: ({ [UNLINK_DOC_FROM_ACTION.name]: mutate }) =>
      async ({ value: goalId }, { _id }) => mutate({
        variables: {
          input: {
            _id,
            documentId: goalId,
          },
        },
        update: updateActionFragment(
          Cache.deleteGoal(goalId),
          {
            id: _id,
            fragment: Fragment.ACTION_CARD,
          },
        ),
      }),
  }),
  withHandlers({
    onSave: ({ createAction, linkGoalToAction }) => ifElse(
      viewEq(0, lenses.active),
      createAction,
      linkGoalToAction,
    ),
  }),
)(GoalActionsSubcard);
