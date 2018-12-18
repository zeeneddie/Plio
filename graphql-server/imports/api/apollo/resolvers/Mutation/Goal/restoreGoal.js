import { applyMiddleware } from 'plio-util';
import {
  flattenInput,
  checkLoggedIn,
  checkGoalAccess,
  ensureCanChangeGoals,
  goalUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.GoalService.restore(args, context);

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkGoalAccess(),
  ensureCanChangeGoals(),
  goalUpdateAfterware(),
)(resolver);
