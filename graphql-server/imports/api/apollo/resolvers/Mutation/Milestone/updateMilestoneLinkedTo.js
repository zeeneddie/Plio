import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkMilestoneAccess,
  checkMilestoneLinkedDocument,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { MilestoneService } }) =>
  MilestoneService.link(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkMilestoneAccess(),
  checkMilestoneLinkedDocument(),
  // check linked doc date range
)(resolver);
