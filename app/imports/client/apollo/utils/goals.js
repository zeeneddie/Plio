import { curry } from 'ramda';
import { Cache } from 'plio-util';

import { Query, Fragment } from '../../graphql';
import { updateQueryCache } from './updateQueryCache';
import updateFragmentCache from './updateFragmentCache';

const TYPE = 'Goal';

export const updateGoalFragment = updateFragmentCache(TYPE);

export const moveGoalWithinCacheAfterDeleting = curry((organizationId, goal, store) => {
  const variables = { organizationId };

  updateQueryCache(Cache.deleteGoalFromDashboardGoalsQuery(goal._id), {
    variables,
    query: Query.DASHBOARD_GOALS,
  }, store);
  updateQueryCache(Cache.addGoalToQuery(goal), {
    variables,
    query: Query.COMPLETED_DELETED_GOALS,
  }, store);
  updateQueryCache(Cache.deleteGoalFromQuery(goal._id), {
    variables,
    query: Query.GOAL_LIST,
  }, store);
});

export const moveGoalWithinCacheAfterRestoring = curry((organizationId, goal, store) => {
  const variables = { organizationId };

  updateQueryCache(Cache.deleteGoalFromQuery(goal._id), {
    variables,
    query: Query.COMPLETED_DELETED_GOALS,
  }, store);
  updateQueryCache(Cache.addGoalToDashboardGoalsQuery(goal), {
    variables,
    query: Query.DASHBOARD_GOALS,
  }, store);
  updateQueryCache(Cache.addGoalToQuery(goal), {
    variables,
    query: Query.GOAL_LIST,
  }, store);
});

export const moveGoalWithinCacheAfterCreating = curry((organizationId, goal, store) => {
  const variables = { organizationId };
  const data = Cache.addGoalToQuery(goal);

  updateQueryCache(data, {
    variables,
    query: Query.DASHBOARD_GOALS,
  }, store);
  updateQueryCache(data, {
    variables,
    query: Query.GOAL_LIST,
  }, store);
});

export const moveGoalWithinCacheAfterRemoving = curry((organizationId, _id, store) => {
  const variables = { organizationId };

  updateQueryCache(Cache.deleteGoalFromQuery(_id), {
    variables,
    query: Query.COMPLETED_DELETED_GOALS,
  }, store);

  updateQueryCache(Cache.decCompletedDeletedGoalsTotalCount, {
    variables,
    query: Query.DASHBOARD_GOALS,
  }, store);
});

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
