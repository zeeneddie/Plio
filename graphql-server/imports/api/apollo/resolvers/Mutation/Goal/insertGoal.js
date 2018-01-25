import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = (root, args, { services: { GoalService }, ...context }) =>
  GoalService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
