import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkGoalAccess,
  flattenInput,
  ensureGoalCanBeCompleted,
  goalUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.GoalService.complete(args, context);

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkGoalAccess(),
  ensureGoalCanBeCompleted(),
  goalUpdateAfterware(),
)(resolver);
