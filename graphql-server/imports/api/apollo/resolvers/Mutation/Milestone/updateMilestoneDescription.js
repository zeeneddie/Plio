import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkMilestoneAccess,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { MilestoneService } }) =>
  MilestoneService.set(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkMilestoneAccess(),
)(resolver);
