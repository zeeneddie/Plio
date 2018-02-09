import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership, flattenInput } from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { GoalService } }) =>
  GoalService.insert(args);

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
