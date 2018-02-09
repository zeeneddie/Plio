import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkGoalAccess, flattenInput } from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { GoalService }, ...context }) =>
  GoalService.undoCompletion(args, context);

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkGoalAccess(),
)(resolver);
