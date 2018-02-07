import connectUI from 'redux-ui';
import { onlyUpdateForKeys, branch, renderNothing } from 'recompose';
import { identity, path, over, dropLast, dec, compose } from 'ramda';
import { graphql } from 'react-apollo';
import { transformGoal, lenses } from 'plio-util';
import gql from 'graphql-tag';

import { namedCompose } from '../../helpers';
import GoalEditModal from '../components/GoalEditModal';
import { Query } from '../../../../client/graphql';

const deleteGoal = compose(
  over(lenses.goals.totalCount, dec),
  over(lenses.goals.goals, dropLast(1)),
);

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
      },
    }) => ({
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
        goal,
        organizationId,
        ...props
      },
    }) => ({
      goal,
      organizationId,
      ...props,
      onDelete: () => mutate({
        variables: {
          input: {
            _id: goal._id,
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
            data: deleteGoal(data),
          });
        },
      }),
    }),
  }),
  onlyUpdateForKeys(['isOpen', 'goal', 'organizationId']),
)(GoalEditModal);
