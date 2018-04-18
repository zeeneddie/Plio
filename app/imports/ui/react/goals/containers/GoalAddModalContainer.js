import { getUserOptions } from 'plio-util';
import { graphql } from 'react-apollo';
import { FORM_ERROR } from 'final-form';
import { withProps } from 'recompose';

import { GoalColors, GoalPriorities } from '../../../../share/constants';
import { moveGoalWithinCacheAfterCreating } from '../../../../client/apollo/utils';
import { namedCompose } from '../../helpers';
import GoalAddModal from '../components/GoalAddModal';
import { Mutation } from '../../../../client/graphql';
import { handleGQError } from '../../../../api/handleGQError';

export default namedCompose('GoalAddModalContainer')(
  withProps(({ owner }) => ({
    initialValues: {
      ownerId: getUserOptions(owner),
      startDate: new Date(),
      priority: GoalPriorities.MINOR,
      color: GoalColors.INDIGO,
    },
  })),
  graphql(Mutation.CREATE_GOAL, {
    props: ({
      mutate,
      ownProps: {
        organizationId,
        toggle,
        isOpen,
      },
    }) => ({
      onSubmit: async ({
        title,
        description,
        ownerId,
        startDate,
        endDate,
        priority,
        color,
      }) => {
        const errors = [];
        if (!title) errors.push('Key goal name is required');
        if (!endDate) errors.push('End Date is required');

        if (errors.length) return { [FORM_ERROR]: errors.join('\n') };

        try {
          await mutate({
            variables: {
              input: {
                title,
                description,
                startDate,
                endDate,
                priority,
                color,
                organizationId,
                ownerId: ownerId.value,
              },
            },
            update: (proxy, { data: { createGoal: { goal } } }) =>
              moveGoalWithinCacheAfterCreating(organizationId, goal, proxy),
          });
          return isOpen && toggle();
        } catch (error) {
          return { [FORM_ERROR]: handleGQError(error) };
        }
      },
    }),
  }),
)(GoalAddModal);
