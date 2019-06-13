import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkOrgMembership,
  flattenInput,
  checkMilestoneLinkedDocument,
  checkMilestoneCompletionTargetDate,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.MilestoneService.insert(args, context);

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkOrgMembership(),
  checkMilestoneLinkedDocument(),
  checkMilestoneCompletionTargetDate(),
  async (next, root, args, context) => {
    const { collections: { Milestones } } = context;
    const _id = await next(root, args, context);
    const milestone = Milestones.findOne({ _id });
    return { milestone };
  },
)(resolver);
