import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, checkOrgMembership, flattenInput } from '../../../../../share/middleware';

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
  flattenInput(),
  checkLoggedIn(),
  checkOrgMembership(),
)(resolver);
