import { curry } from 'ramda';
import { Cache } from 'plio-util';

import { Fragment } from '../../graphql';
import updateFragmentCache from './updateFragmentCache';

const TYPE = 'Goal';

export const updateGoalFragment = updateFragmentCache(TYPE);

export const addActionToGoalFragment = curry((goalId, action, store) => {
  updateGoalFragment(Cache.addAction({ ...action, __typename: 'Action' }), {
    id: goalId,
    fragment: Fragment.DASHBOARD_GOAL,
  }, store);
});

export const deleteActionFromGoalFragment = curry((goalId, actionId, store) => {
  updateGoalFragment(Cache.deleteActionById(actionId), {
    id: goalId,
    fragment: Fragment.DASHBOARD_GOAL,
  }, store);
});
