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
import { resolveLinkedGoal } from '../../Types/util';

export const resolver = async (root, args, context) =>
  context.services.MilestoneService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkMilestoneAccess(),
  branch(
    (root, args) => args.completedAt || args.completionComments,
    ensureIsCompleted(),
  ),
  branch(
    (root, args) => args.completionTargetDate,
    composeMiddleware(
      checkGoalAccess(async (root, args, context) => {
        const { _id } = await resolveLinkedGoal(root, args, context);
        return { query: { _id } };
      }),
      checkMilestoneCompletionTargetDate(),
    ),
  ),
  // TODO: check notify users access
  milestoneUpdateAfterware(),
)(resolver);
