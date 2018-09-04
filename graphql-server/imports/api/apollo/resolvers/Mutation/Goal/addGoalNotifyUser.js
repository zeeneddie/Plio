import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkGoalAccess,
  checkOrgMembership,
  userUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { GoalService } }) =>
  GoalService.addToNotify(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkGoalAccess(),
  checkOrgMembership(({ organizationId }, { userId }) => ({
    organizationId,
    userId,
  })),
  userUpdateAfterware((root, { userId }) => ({ _id: userId })),
)(resolver);
