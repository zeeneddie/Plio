import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkGoalAccess,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { GoalService } }) =>
  GoalService.updatePriority(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkGoalAccess(),
)(resolver);
