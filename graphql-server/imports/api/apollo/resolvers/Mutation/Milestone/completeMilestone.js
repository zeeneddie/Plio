import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkMilestoneAccess,
  ensureIsNotCompleted,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { MilestoneService } }) =>
  MilestoneService.complete(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkMilestoneAccess(),
  ensureIsNotCompleted(),
)(resolver);
