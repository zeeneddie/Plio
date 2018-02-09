import connectUI from 'redux-ui';
import { onlyUpdateForKeys, branch, renderNothing } from 'recompose';
import { identity, path, over, reject, where, equals, dec, compose } from 'ramda';
import { graphql } from 'react-apollo';
import { transformGoal, lenses } from 'plio-util';
import gql from 'graphql-tag';

import { namedCompose } from '../../helpers';
import GoalEditModal from '../components/GoalEditModal';
import { Query } from '../../../../client/graphql';
import { swal } from '../../../../client/util';

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
  connectUI({
    state: {
      loading: false,
      error: null,
    },
  }),
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
        ui: { loading: uiLoading, error },
      },
    }) => ({
      isOpen,
      toggle,
      organizationId,
      error,
      loading: loading || uiLoading,
      goal: goal ? transformGoal(goal) : null,
    }),
  }),
  graphql(DELETE_GOAL, {
    props: ({
      mutate,
      ownProps: {
        organizationId,
        toggle,
        goal,
        ...props
      },
    }) => ({
      organizationId,
      toggle,
      goal,
      ...props,
      onDelete: () => swal.promise({
        text: `The goal "${goal.title}" will be deleted`,
        confirmButtonText: 'Delete',
      }, () => mutate({
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
            data: deleteGoal(goal._id, data),
          });
        },
      }).then(toggle)),
    }),
  }),
  onlyUpdateForKeys(['isOpen', 'goal', 'organizationId']),
)(GoalEditModal);
