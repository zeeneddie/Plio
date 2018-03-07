import connectUI from 'redux-ui';
import { branch, renderNothing } from 'recompose';
import { identity, path } from 'ramda';
import { graphql } from 'react-apollo';
import { transformGoal } from 'plio-util';

import { namedCompose, withStateToggle } from '../../helpers';
import GoalEditModal from '../components/GoalEditModal';
import { Query, Mutation } from '../../../../client/graphql';
import { onDelete } from '../handlers';

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
    props: props => ({
      onDelete: () => onDelete(props, props.ownProps.toggle),
    }),
  }),
  withStateToggle(false, 'isGuidancePanelOpen', 'toggleGuidancePanel'),
)(GoalEditModal);
