import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkMilestoneAccess,
  checkUserOrgMembership,
  milestoneUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { MilestoneService } }) =>
  MilestoneService.removeFromNotify(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkMilestoneAccess(),
  checkUserOrgMembership({
    getUserId: (root, args) => args.userId,
  }),
  milestoneUpdateAfterware(),
)(resolver);
