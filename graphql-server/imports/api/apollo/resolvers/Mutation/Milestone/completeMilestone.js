import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkMilestoneAccess,
  ensureIsNotCompleted,
  milestoneUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.MilestoneService.complete(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkMilestoneAccess(),
  ensureIsNotCompleted(),
  milestoneUpdateAfterware(),
)(resolver);
