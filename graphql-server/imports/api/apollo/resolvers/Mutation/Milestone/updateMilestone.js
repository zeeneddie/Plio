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
  checkMultipleOrgMembership,
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
  branch(
    (root, args) => args.notify,
    checkMultipleOrgMembership(({ organizationId }, { notify }) => ({
      userIds: notify,
      organizationId,
    })),
  ),
  milestoneUpdateAfterware(),
)(resolver);
