import { applyMiddleware } from 'plio-util';
import { checkLoggedIn } from '../../../../../share/middleware';

export const resolver = async (
  root,
  args,
  {
    services: { GoalService },
  },
) => GoalService.updateTitle(args);

export default applyMiddleware(
  async (next, root, { input }, context) => next(root, input, context),
  checkLoggedIn(),
)(resolver);
