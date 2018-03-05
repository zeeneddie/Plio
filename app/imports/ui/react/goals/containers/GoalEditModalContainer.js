import connectUI from 'redux-ui';
import { branch, renderNothing } from 'recompose';
import { identity, path } from 'ramda';
import { graphql } from 'react-apollo';
import { transformGoal } from 'plio-util';

import { moveGoalWithinCacheAfterDeleting } from '../../../../client/apollo/utils/goals';
import { namedCompose, withStateToggle } from '../../helpers';
import GoalEditModal from '../components/GoalEditModal';
import { Query, Mutation } from '../../../../client/graphql';
import { swal } from '../../../../client/util';

export default namedCompose('GoalEditModalContainer')(
  connectUI(),
  branch(
    path(['ui', 'activeGoal']),
    identity,
    renderNothing,
  ),
  graphql(Query.GOAL_CARD, {
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
        ui: { error },
      },
    }) => ({
      isOpen,
      toggle,
      organizationId,
      error,
      loading,
      goal: goal ? transformGoal(goal) : null,
    }),
  }),
  graphql(Mutation.DELETE_GOAL, {
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
        update: (proxy, { data: { deleteGoal: { goal: removedGoal } } }) => {
          moveGoalWithinCacheAfterDeleting(organizationId, removedGoal, proxy);
        },
      }).then(toggle)),
    }),
  }),
  withStateToggle(false, 'isGuidancePanelOpen', 'toggleGuidancePanel'),
)(GoalEditModal);
