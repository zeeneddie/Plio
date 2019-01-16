import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkMilestoneAccess,
  flattenInput,
} from '../../../../../share/middleware';

export const resolver = async (milestone, args, context) =>
  context.services.MilestoneService.remove(args, { ...context, milestone });

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkMilestoneAccess(),
  async (next, root, args, context) => {
    const { _id } = args;
    const { collections: { Milestones } } = context;
    const milestone = Milestones.findOne({ _id });

    await next(root, args, context);

    return { milestone };
  },
)(resolver);
