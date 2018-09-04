import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkGoalAccess,
  checkOrgMembership,
  goalUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { GoalService } }) =>
  GoalService.set(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkGoalAccess(),
  checkOrgMembership(({ organizationId }, { ownerId }) => ({
    organizationId,
    userId: ownerId,
  })),
  goalUpdateAfterware(),
)(resolver);
