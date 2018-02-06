import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkGoalAccess,
} from '../../../../../share/middleware';
import { Goals } from '../../../../../share/collections';

export const resolver = async (
  root,
  args,
  {
    services: { GoalService },
  },
) => GoalService.updateTitle(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkGoalAccess(Goals),
)(resolver);
