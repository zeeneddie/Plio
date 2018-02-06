import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkGoalAccess,
  checkNewOwnerOrgMembership,
} from '../../../../../share/middleware';

export const resolver = async (
  root,
  args,
  {
    services: { GoalService },
  },
) => GoalService.updateOwner(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkGoalAccess(),
  checkNewOwnerOrgMembership(),
)(resolver);
