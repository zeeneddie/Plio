import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkGoalAccess,
  flattenInput,
  ensureGoalCompletionCanBeUndone,
  goalUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.GoalService.undoCompletion(args, context);

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkGoalAccess(),
  ensureGoalCompletionCanBeUndone(),
  goalUpdateAfterware(),
)(resolver);
