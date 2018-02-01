import connectUI from 'redux-ui';
import { mapProps } from 'recompose';
import { lenses } from 'plio-util';
import { view, over, compose, append, inc } from 'ramda';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { namedCompose, withStore } from '../../helpers';
import GoalAddModal from '../components/GoalAddModal';
import { GoalPriorities } from '../../../../share/constants';
import { DASHBOARD_GOALS_QUERY } from '../../../../api/graphql/query';
import { DASHBOARD_GOAL_FRAGMENT } from '../../../../api/graphql/Fragment';

const addGoal = (goal, data) => compose(
  over(lenses.goals.goals, append(goal)),
  over(lenses.goals.totalCount, inc),
)(data);

const INSERT_GOAL_MUTATION = gql`
  mutation insertGoal($input: InsertGoalInput!) {
    insertGoal(input: $input) {
      goal {
        ...DashboardGoal
      }
    }
  }
  ${DASHBOARD_GOAL_FRAGMENT}
`;

export default namedCompose('GoalAddModalContainer')(
  withStore,
  connectUI({
    state: {
      title: '',
      description: '',
      ownerId: view(lenses.ownerId),
      startDate: () => new Date(),
      endDate: null,
      priority: GoalPriorities.MINOR,
      color: '',
      errorText: '',
      isSaving: false,
    },
  }),
  graphql(INSERT_GOAL_MUTATION, {
    props: ({
      mutate,
      ownProps: {
        updateUI,
        organizationId,
        toggle,
        isOpen,
        ui: {
          title,
          description,
          ownerId,
          startDate,
          endDate,
          priority,
          color = '',
        },
      },
    }) => ({
      onSubmit: () => {
        updateUI('isSaving', true);

        return mutate({
          variables: {
            input: {
              organizationId,
              title,
              description,
              ownerId,
              startDate,
              endDate,
              priority,
              color: color.toUpperCase(),
            },
          },
          update: (proxy, { data: { insertGoal: { goal } } }) => {
            const data = addGoal(goal, proxy.readQuery({
              query: DASHBOARD_GOALS_QUERY,
              variables: { organizationId },
            }));

            return proxy.writeQuery({
              data,
              query: DASHBOARD_GOALS_QUERY,
              variables: { organizationId },
            });
          },
        }).then(() => {
          updateUI('isSaving', false);
          return isOpen && toggle();
        }).catch(({ message }) => updateUI({
          errorText: message,
          isSaving: false,
        }));
      },
    }),
  }),
  mapProps(({
    ui: { errorText, isSaving },
    ...props
  }) => ({ errorText, isSaving, ...props })),
)(GoalAddModal);
