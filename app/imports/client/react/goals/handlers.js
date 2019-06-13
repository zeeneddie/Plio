import { curry } from 'ramda';

import { swal } from '../../util';
import { Query, Mutation } from '../../graphql';

export const onDelete = ({ mutate, ownProps: { organizationId, goal } }, callback) => swal.promise({
  text: `The goal "${goal.title}" will be deleted`,
  confirmButtonText: 'Delete',
  successTitle: 'Deleted!',
  successText: `The key goal "${goal.title}" was deleted successfully.`,
}, () => mutate({
  variables: {
    input: {
      _id: goal._id,
    },
  },
  refetchQueries: [
    Query.DASHBOARD_GOALS.name,
    Query.COMPLETED_DELETED_GOALS.name,
    Query.GOAL_LIST.name,
    {
      query: Query.CANVAS_PAGE,
      variables: { organizationId },
    },
  ],
}).then(callback));

export const onComplete = ({ mutate, ownProps: { goal } }) => mutate({
  variables: {
    input: {
      _id: goal._id,
    },
  },
  refetchQueries: [
    Query.DASHBOARD_GOALS.name,
    Query.COMPLETED_DELETED_GOALS.name,
    Query.GOAL_LIST.name,
  ],
});

export const createRestoreHandler = curry((
  mutationName,
  { [mutationName]: mutate, organizationId },
) => ({ _id, title }) => swal.promise({
  text: `The key goal "${title}" will be restored!`,
  confirmButtonText: 'Restore',
  successTitle: 'Restored!',
  successText: `The key goal "${title}" was restored successfully.`,
}, () => mutate({
  variables: { input: { _id } },
  refetchQueries: [
    Query.DASHBOARD_GOALS.name,
    Query.COMPLETED_DELETED_GOALS.name,
    Query.GOAL_LIST.name,
    {
      query: Query.CANVAS_PAGE,
      variables: { organizationId },
    },
  ],
})));

export const onRemove = ({ [Mutation.REMOVE_GOAL.name]: mutate }) =>
  ({ _id, title }) => swal.promise({
    text: `The goal "${title}" will be deleted permanently`,
    confirmButtonText: 'Delete',
    successTitle: 'Deleted!',
    successText: `The key goal "${title}" was removed successfully.`,
  }, () => mutate({
    variables: { input: { _id } },
    refetchQueries: [
      Query.DASHBOARD_GOALS.name,
      Query.COMPLETED_DELETED_GOALS.name,
    ],
  }));
