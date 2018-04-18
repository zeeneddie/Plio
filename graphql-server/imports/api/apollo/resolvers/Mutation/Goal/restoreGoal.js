import { applyMiddleware } from 'plio-util';
import {
  flattenInput,
  checkLoggedIn,
  checkGoalAccess,
  ensureCanChangeGoals,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { GoalService }, ...context }) =>
  GoalService.restore(args, context);

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkGoalAccess(),
  ensureCanChangeGoals(),
)(resolver);
