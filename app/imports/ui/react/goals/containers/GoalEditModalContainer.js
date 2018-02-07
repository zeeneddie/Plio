import connectUI from 'redux-ui';
import { onlyUpdateForKeys, branch, renderNothing } from 'recompose';
import { identity, path, over, reject, where, equals, dec, compose } from 'ramda';
import { graphql } from 'react-apollo';
import { transformGoal, lenses } from 'plio-util';
import gql from 'graphql-tag';

import { namedCompose } from '../../helpers';
import GoalEditModal from '../components/GoalEditModal';
import { Query } from '../../../../client/graphql';

const deleteGoal = (_id, data) => compose(
  over(lenses.goals.totalCount, dec),
  over(lenses.goals.goals, reject(where({ _id: equals(_id) }))),
)(data);

const DELETE_GOAL = gql`
  mutation deleteGoal($input: DeleteGoalInput!) {
    deleteGoal(input: $input) {
      goal {
        _id
      }
    }
  }
`;

export default namedCompose('GoalEditModalContainer')(
  connectUI(),
  branch(
    path(['ui', 'activeGoal']),
    identity,
    renderNothing,
  ),
  graphql(Query.GOAL_EDIT, {
    options: ({
      ui: { activeGoal },
    }) => ({
      variables: {
        _id: activeGoal,
      },
    }),
    props: ({
      data: {
        loading,
        goal: {
          goal,
        } = {},
      },
      ownProps: {
        isOpen,
        toggle,
        organizationId,
        ui: { activeGoal },
      },
    }) => ({
      activeGoal,
      loading,
      isOpen,
      toggle,
      organizationId,
      goal: goal ? transformGoal(goal) : null,
    }),
  }),
  graphql(DELETE_GOAL, {
    props: ({
      mutate,
      ownProps: {
        organizationId,
        activeGoal,
        ...props
      },
    }) => ({
      organizationId,
      ...props,
      onDelete: () => mutate({
        variables: {
          input: {
            _id: activeGoal,
          },
        },
        update: (proxy) => {
          const data = proxy.readQuery({
            query: Query.DASHBOARD_GOALS,
            variables: { organizationId },
          });

          return proxy.writeQuery({
            query: Query.DASHBOARD_GOALS,
            variables: { organizationId },
            data: deleteGoal(activeGoal, data),
          });
        },
      }),
    }),
  }),
  onlyUpdateForKeys(['isOpen', 'goal', 'organizationId']),
)(GoalEditModal);
