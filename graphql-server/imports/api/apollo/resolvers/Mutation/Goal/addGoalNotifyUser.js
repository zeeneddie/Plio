import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkGoalAccess,
  checkUserOrgMembership,
  userUpdateAfterware,
} from '../../../../../share/middleware';

const getUserId = (root, args) => args.userId;

export const resolver = async (root, args, { services: { GoalService } }) =>
  GoalService.addToNotify(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkGoalAccess(),
  checkUserOrgMembership({ getUserId }),
  userUpdateAfterware({ getId: getUserId }),
)(resolver);
