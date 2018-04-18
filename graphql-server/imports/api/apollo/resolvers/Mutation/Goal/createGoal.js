import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkOrgMembership,
  flattenInput,
  ensureCanChangeGoals,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { GoalService } }) =>
  GoalService.insert(args);

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkOrgMembership(),
  ensureCanChangeGoals((root, args) => args.organizationId),
)(resolver);
