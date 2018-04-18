import { Cache, noop } from 'plio-util';
import { FORM_ERROR } from 'final-form';
import { identity, tap } from 'ramda';
import { swal } from '../../../client/util';
import { updateGoalFragment } from '../../../client/apollo';
import { Mutation, Fragment } from '../../../client/graphql';

const { GOAL_CARD } = Fragment;
const { DELETE_MILESTONE, CREATE_MILESTONE } = Mutation;

export const onDelete = ({ [DELETE_MILESTONE.name]: mutate, linkedTo = {} }) =>
  (e, { entity: { _id, title } }) => swal.promise({
    text: `The milestone "${title}" will be deleted`,
    confirmButtonText: 'Delete',
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
  onCreate = noop,
}) => async ({
  title,
  description,
  completionTargetDate,
}) => {
  const errors = [];

  if (!title) errors.push('Title is required');
  if (!completionTargetDate) errors.push('Completion - target date is required');

  if (errors.length) return { [FORM_ERROR]: errors.join('\n') };

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
  })).then(tap(onCreate));
};
