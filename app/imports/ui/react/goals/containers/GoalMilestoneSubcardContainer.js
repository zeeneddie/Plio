import { graphql } from 'react-apollo';
import { getTargetValue, toDate } from 'plio-util';

import { namedCompose, withMutationState } from '../../helpers';
import { MilestoneSubcard } from '../../milestones';
import { Mutation, Fragment } from '../../../../client/graphql';
import { updateMilestoneFragment } from '../../../../client/apollo';

export default namedCompose('GoalMilestoneSubcardContainer')(
  withMutationState(),
  graphql(Mutation.UPDATE_MILESTONE_TITLE, { name: 'updateTitle' }),
  graphql(Mutation.UPDATE_MILESTONE_DESCRIPTION, { name: 'updateDescription' }),
  graphql(Mutation.UPDATE_MILESTONE_COMPLETED_AT, { name: 'updateCompletedAt' }),
  graphql(Mutation.UPDATE_MILESTONE_COMPLETION_COMMENT, { name: 'updateCompletionComment' }),
  graphql(Mutation.UPDATE_MILESTONE_COMPLETION_TARGET_DATE, {
    name: 'updateCompletionTargetDate',
    props: ({
      updateCompletionTargetDate,
      ownProps: {
        ui: { error, loading },
        milestone: { _id },
        linkedTo: { _id: linkedTo },
        mutateWithState,
        updateTitle,
        updateDescription,
        updateCompletedAt,
        updateCompletionComment,
      },
    }) => {
      const update = name => (proxy, { data: { [name]: { milestone } } }) =>
        updateMilestoneFragment(
          data => ({ ...data, milestone }),
          {
            id: _id,
            fragment: Fragment.MILESTONE_CARD,
          },
        );

      return {
        error,
        loading,
        onChangeTitle: e => mutateWithState(updateTitle({
          variables: {
            input: {
              _id,
              title: getTargetValue(e),
            },
          },
          update: update('updateMilestoneTitle'),
        })),
        onChangeDescription: e => mutateWithState(updateDescription({
          variables: {
            input: {
              _id,
              description: getTargetValue(e),
            },
          },
          update: update('updateMilestoneDescription'),
        })),
        onChangeCompletionTargetDate: momentDate => mutateWithState(updateCompletionTargetDate({
          variables: {
            input: {
              _id,
              linkedTo,
              completionTargetDate: toDate(momentDate),
            },
          },
          update: update('updateMilestoneCompletionTargetDate'),
        })),
        onChangeMilestoneCompletedAt: momentDate => mutateWithState(updateCompletedAt({
          variables: {
            input: {
              _id,
              completedAt: toDate(momentDate),
            },
          },
          update: update('updateMilestoneCompletedAt'),
        })),
        onChangeMilestoneCompletionComment: e => mutateWithState(updateCompletionComment({
          variables: {
            input: {
              _id,
              completionComment: getTargetValue(e),
            },
          },
          update: update('updateMilestoneCompletionComment'),
        })),
      };
    },
  }),
)(MilestoneSubcard);
