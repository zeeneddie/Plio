import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkMilestoneAccess,
  flattenInput,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { MilestoneService } }) =>
  MilestoneService.remove(args);

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
