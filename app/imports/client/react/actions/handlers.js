import { Cache, mapRejectedEntitiesToOptions } from 'plio-util';
import { identity } from 'ramda';

import { swal } from '../../util';
import { Mutation, Fragment, Query } from '../../graphql';
import { updateGoalFragment } from '../../apollo/utils';
import { client } from '../../apollo';
import { DocumentTypes, ActionTypes } from '../../../share/constants';

const {
  DELETE_ACTION,
  CREATE_ACTION,
  LINK_DOC_TO_ACTION,
} = Mutation;

export const createGeneralAction = ({
  organizationId,
  goalId,
  [CREATE_ACTION.name]: mutate,
  mutateWithState = identity,
}) => async ({
  title,
  description,
  completionTargetDate,
  owner: { value: ownerId },
  toBeCompletedBy: { value: toBeCompletedBy },
}) => {
  if (!title) throw new Error('Title is required');

  return mutateWithState(mutate({
    variables: {
      input: {
        title,
        description,
        ownerId,
        organizationId,
        toBeCompletedBy,
        completionTargetDate,
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
  }));
};

export const onDelete = ({ [DELETE_ACTION.name]: mutate, goalId }) =>
  (e, { entity: { _id, title } }) => (
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
    }))
  );

export const linkGoalToAction = ({
  goalId,
  [LINK_DOC_TO_ACTION.name]: mutate,
  mutateWithState = identity,
}) => async ({ action: { value: actionId } = {} }) => {
  if (!actionId) throw new Error('Action is required');

  return mutateWithState(mutate({
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
  }));
};

export const loadActions = ({ organizationId, actions }) => () => client.query({
  query: Query.ACTION_LIST,
  variables: {
    organizationId,
    type: ActionTypes.GENERAL_ACTION,
  },
}).then(({ data: { actions: { actions: resultActions } } }) => ({
  options: mapRejectedEntitiesToOptions(actions, resultActions),
}));
