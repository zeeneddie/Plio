import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkGoalAccess,
  flattenInput,
  ensureCanChangeGoals,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { doc, services: { GoalService }, ...context }) =>
  GoalService.remove(args, { ...context, goal: doc });

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkGoalAccess(),
  ensureCanChangeGoals(),
)(resolver);
