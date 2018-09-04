import { Cache } from 'plio-util';
import { identity } from 'ramda';
import { swal } from '../../util';
import { updateGoalFragment } from '../../apollo';
import { Mutation, Fragment } from '../../graphql';

const { GOAL_CARD } = Fragment;
const { DELETE_MILESTONE, CREATE_MILESTONE } = Mutation;

export const onDelete = ({ [DELETE_MILESTONE.name]: mutate, linkedTo = {} }) =>
  (e, { entity: { _id, title } }) => swal.promise({
    text: `The milestone "${title}" will be deleted`,
    confirmButtonText: 'Delete',
    successTitle: 'Deleted!',
    successText: `The milestone "${title}" was deleted successfully.`,
  }, () => mutate({
    variables: {
      input: { _id },
    },
    update: updateGoalFragment(Cache.deleteMilestoneById(_id), {
      id: linkedTo._id,
      fragment: GOAL_CARD,
    }),
  }));

export const onSave = ({
  [CREATE_MILESTONE.name]: mutate,
  mutateWithState = identity,
  organizationId,
  linkedTo,
}) => async ({
  title,
  description,
  completionTargetDate,
}) => {
  const errors = [];

  if (!title) errors.push('Title is required');
  if (!completionTargetDate) errors.push('Completion - target date is required');
  if (errors.length) throw new Error(errors.join('\n'));

  return mutateWithState(mutate({
    variables: {
      input: {
        title,
        description,
        completionTargetDate,
        organizationId,
        linkedTo: linkedTo._id,
      },
    },
    update: (proxy, { data: { createMilestone: { milestone } } }) => updateGoalFragment(
      Cache.addMilestone(milestone),
      {
        id: linkedTo._id,
        fragment: GOAL_CARD,
      },
      proxy,
    ),
  }));
};
