import connectUI from 'redux-ui';
import { mapProps } from 'recompose';
import { lenses } from 'plio-util';
import { view, over, compose, append, inc } from 'ramda';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { namedCompose, withStore } from '../../helpers';
import GoalAddModal from '../components/GoalAddModal';
import { GoalPriorities } from '../../../../share/constants';
import { Query, Fragment } from '../../../../client/graphql';

const addGoal = (goal, data) => compose(
  over(lenses.goals.goals, append(goal)),
  over(lenses.goals.totalCount, inc),
)(data);

const CREATE_GOAL = gql`
  mutation createGoal($input: CreateGoalInput!) {
    createGoal(input: $input) {
      goal {
        ...DashboardGoal
      }
    }
  }
  ${Fragment.DASHBOARD_GOAL}
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
  graphql(CREATE_GOAL, {
    props: ({
      mutate,
      ownProps: {
        updateUI,
        resetUI,
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
      onClosed: resetUI,
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
          update: (proxy, { data: { createGoal: { goal } } }) => {
            const data = addGoal(goal, proxy.readQuery({
              query: Query.DASHBOARD_GOALS,
              variables: { organizationId },
            }));

            return proxy.writeQuery({
              data,
              query: Query.DASHBOARD_GOALS,
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
