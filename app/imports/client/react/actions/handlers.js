import { Cache } from 'plio-util';

import { swal } from '../../util';
import { Mutation, Fragment } from '../../graphql';
import { updateGoalFragment } from '../../apollo/utils';

const { DELETE_ACTION } = Mutation;

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
