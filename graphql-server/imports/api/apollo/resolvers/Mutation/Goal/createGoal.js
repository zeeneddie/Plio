import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (
  root,
  args,
  {
    services: { GoalService },
    collections: { Goals },
  },
) => GoalService.insert(args)
  .then(_id => Goals.findOne({ _id }))
  .then(goal => ({ goal }));

export default applyMiddleware(
  async (next, root, { input }, context) => next(root, input, context),
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
