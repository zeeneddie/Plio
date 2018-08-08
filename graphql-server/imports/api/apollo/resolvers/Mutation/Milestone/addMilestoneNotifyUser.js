import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkMilestoneAccess,
  checkOrgMembership,
  userUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { MilestoneService } }) =>
  MilestoneService.addToNotify(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkMilestoneAccess(),
  checkOrgMembership(({ organizationId }, { userId }) => ({
    organizationId,
    userId,
  })),
  userUpdateAfterware((root, { userId }) => ({ userId })),
)(resolver);
