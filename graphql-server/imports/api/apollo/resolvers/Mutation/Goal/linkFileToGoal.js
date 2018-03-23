import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkGoalAccess,
  flattenInput,
  goalUpdateAfterware,
  checkDocExistance,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { GoalService } }) =>
  GoalService.linkFile(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkGoalAccess(),
  checkDocExistance(
    ({ fileId }) => ({ _id: fileId }),
    (root, args, { collections: { Files } }) => Files,
  ),
  goalUpdateAfterware(),
)(resolver);
