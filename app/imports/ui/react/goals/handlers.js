import { swal } from '../../../client/util';
import { moveGoalWithinCacheAfterDeleting } from '../../../client/apollo/utils/goals';

export const onDelete = ({ mutate, ownProps: { organizationId, goal } }, callback) => swal.promise({
  text: `The goal "${goal.title}" will be deleted`,
  confirmButtonText: 'Delete',
}, () => mutate({
  variables: {
    input: {
      _id: goal._id,
    },
  },
  update: (proxy, { data: { deleteGoal: { goal: removedGoal } } }) => {
    if (!removedGoal.isCompleted) {
      moveGoalWithinCacheAfterDeleting(organizationId, removedGoal, proxy);
    }
  },
}).then(callback));

export const onComplete = ({ mutate, ownProps: { organizationId, goal } }) => mutate({
  variables: {
    input: {
      _id: goal._id,
    },
  },
  update: (proxy, { data: { completeGoal: { goal: completedGoal } } }) => {
    moveGoalWithinCacheAfterDeleting(organizationId, completedGoal, proxy);
  },
});
