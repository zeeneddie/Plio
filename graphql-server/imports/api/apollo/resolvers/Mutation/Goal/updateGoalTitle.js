import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, flattenInput } from '../../../../../share/middleware';

export const resolver = async (
  root,
  args,
  {
    services: { GoalService },
  },
) => GoalService.updateTitle(args);

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
)(resolver);
