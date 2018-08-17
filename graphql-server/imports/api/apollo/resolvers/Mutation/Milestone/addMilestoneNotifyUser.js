import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkMilestoneAccess,
  checkUserOrgMembership,
  userUpdateAfterware,
} from '../../../../../share/middleware';

const getUserId = (root, args) => args.userId;

export const resolver = async (root, args, { services: { MilestoneService } }) =>
  MilestoneService.addToNotify(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkMilestoneAccess(),
  checkUserOrgMembership({ getUserId }),
  userUpdateAfterware({ getId: getUserId }),
)(resolver);
