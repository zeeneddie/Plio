import { curry } from 'ramda';
import { Cache } from 'plio-util';
import { Query } from '../../graphql';
import { updateQueryCache } from './updateQueryCache';

export const moveGoalWithinCacheAfterDeleting = curry((organizationId, goal, store) => {
  const variables = { organizationId };
  updateQueryCache(Cache.deleteGoal(goal._id), {
    variables,
    query: Query.DASHBOARD_GOALS,
  }, store);
  updateQueryCache(Cache.addGoal(goal), {
    variables,
    query: Query.COMPLETED_DELETED_GOALS,
  }, store);
});

export const moveGoalWithinCacheAfterRestoring = curry((organizationId, goal, store) => {
  const variables = { organizationId };
  updateQueryCache(Cache.deleteGoal(goal._id), {
    variables,
    query: Query.COMPLETED_DELETED_GOALS,
  }, store);
  updateQueryCache(Cache.addGoal(goal), {
    variables,
    query: Query.DASHBOARD_GOALS,
  }, store);
});
