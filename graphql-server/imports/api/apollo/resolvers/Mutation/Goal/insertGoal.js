import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export default applyMiddleware(
  (next, root, args, context) => checkLoggedIn()(next, args, context),
  checkOrgMembership(),
)((root, args, { services: { GoalService }, ...context }) => GoalService.insert(args, ...context));
