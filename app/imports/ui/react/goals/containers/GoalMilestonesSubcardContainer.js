import { graphql } from 'react-apollo';
import { Cache } from 'plio-util';
import { FORM_ERROR } from 'final-form';

import GoalMilestonesSubcard from '../components/GoalMilestonesSubcard';
import { Mutation, Fragment } from '../../../../client/graphql';
import { namedCompose } from '../../helpers';
import { swal } from '../../../../client/util';
import { updateGoalFragment } from '../../../../client/apollo';

export default namedCompose('GoalMilestonesSubcardContainer')(
  graphql(Mutation.CREATE_MILESTONE, {
    props: ({
      mutate,
      ownProps: {
        organizationId,
        linkedTo,
      },
    }) => ({
      onSave: (
        {
          title,
          description,
          completionTargetDate,
        },
        {
          ownProps: { flush },
        },
        callback,
      ) => mutate({
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
            fragment: Fragment.GOAL_CARD,
          },
          proxy,
        ),
      }).then(({ data: { createMilestone: { milestone } } }) => flush(milestone))
        .catch(({ message }) => callback({ [FORM_ERROR]: message })),
    }),
  }),
  graphql(Mutation.DELETE_MILESTONE, {
    props: ({
      mutate,
      ownProps: {
        linkedTo = {},
      },
    }) => ({
      onDelete: (e, {
        entity: { _id, title },
      }) => swal.promise({
        text: `The milestone "${title}" will be deleted`,
        confirmButtonText: 'Delete',
      }, () => mutate({
        variables: {
          input: { _id },
        },
        update: updateGoalFragment(Cache.deleteMilestoneById(_id), {
          id: linkedTo._id,
          fragment: Fragment.GOAL_CARD,
        }),
      })),
    }),
  }),
)(GoalMilestonesSubcard);
