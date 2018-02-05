import connectUI from 'redux-ui';
import { onlyUpdateForKeys, branch, renderNothing } from 'recompose';
import { identity, path } from 'ramda';

import { namedCompose, withFragment } from '../../helpers';
import GoalEditModal from '../components/GoalEditModal';
import { Fragment } from '../../../../client/graphql';

export default namedCompose('GoalEditModalContainer')(
  connectUI(),
  branch(
    path(['ui', 'activeGoal']),
    identity,
    renderNothing,
  ),
  withFragment(Fragment.DASHBOARD_GOAL, {
    name: 'goal',
    getFragmentId: ({ ui: { activeGoal } }) => `Goal:${activeGoal}`,
    props: ({
      goal,
      isOpen,
      toggle,
    }) => ({
      isOpen,
      toggle,
      goal,
    }),
  }),
  onlyUpdateForKeys(['isOpen', 'goal']),
)(GoalEditModal);
