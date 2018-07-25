import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkGoalAccess,
  ensureCanUpdateStartDate,
  goalUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { GoalService } }) =>
  GoalService.set(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkGoalAccess(),
  ensureCanUpdateStartDate(),
  goalUpdateAfterware(),
)(resolver);
