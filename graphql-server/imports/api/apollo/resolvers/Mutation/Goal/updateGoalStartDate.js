import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkGoalAccess,
  ensureCanUpdateStartDate,
  ensureCanChangeGoals,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { GoalService } }) =>
  GoalService.set(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkGoalAccess(),
  ensureCanChangeGoals(),
  ensureCanUpdateStartDate(),
)(resolver);
