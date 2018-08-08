import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkGoalAccess,
  checkOrgMembership,
  goalUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { GoalService } }) =>
  GoalService.removeFromNotify(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkGoalAccess(),
  checkOrgMembership(({ organizationId }, { userId }) => ({
    organizationId,
    userId,
  })),
  goalUpdateAfterware(),
)(resolver);
