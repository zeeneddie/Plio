import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkMilestoneAccess,
  flattenInput,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { MilestoneService }, ...context }) =>
  MilestoneService.delete(args, context);

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkMilestoneAccess(),
)(resolver);
