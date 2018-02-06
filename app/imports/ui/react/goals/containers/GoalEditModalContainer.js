import connectUI from 'redux-ui';
import { onlyUpdateForKeys, branch, renderNothing } from 'recompose';
import { identity, path } from 'ramda';
import { graphql } from 'react-apollo';
import { transformGoal } from 'plio-util';

import { namedCompose } from '../../helpers';
import GoalEditModal from '../components/GoalEditModal';
import { Query } from '../../../../client/graphql';

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
  onlyUpdateForKeys(['isOpen', 'goal', 'organizationId']),
)(GoalEditModal);
