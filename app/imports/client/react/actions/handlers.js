import { mapRejectedEntitiesToOptions } from 'plio-util';
import { identity } from 'ramda';

import { swal } from '../../util';
import { Mutation, Query } from '../../graphql';
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
}, form) => {
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
    refetchQueries: [{
      query: Query.DASHBOARD_GOAL,
      variables: { _id: goalId },
    }],
  })).finally(() => {
    form.setConfig('keepDirtyOnReinitialize', false);
    setTimeout(() => {
      form.setConfig('keepDirtyOnReinitialize', true);
    }, 0);
  });
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
      refetchQueries: [{
        query: Query.DASHBOARD_GOAL,
        variables: { _id: goalId },
      }],
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
    refetchQueries: [{
      query: Query.DASHBOARD_GOAL,
      variables: { _id: goalId },
    }],
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
