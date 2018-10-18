import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkMilestoneAccess,
  milestoneUpdateAfterware,
  branch,
  checkMilestoneCompletionTargetDate,
  ensureIsCompleted,
  composeMiddleware,
  checkGoalAccess,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.MilestoneService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkMilestoneAccess(),
  branch(
    (root, args) => args.completionTargetDate,
    composeMiddleware(
      checkGoalAccess(({ _id }) => ({ query: { milestoneIds: _id } })),
      checkMilestoneCompletionTargetDate(),
    ),
  ),
  branch(
    (root, args) => args.completedAt || args.completionComments,
    ensureIsCompleted(),
  ),
  // TODO: check notify users access
  milestoneUpdateAfterware(),
)(resolver);
