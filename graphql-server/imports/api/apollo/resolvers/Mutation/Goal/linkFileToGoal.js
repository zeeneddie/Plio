import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkGoalAccess,
  flattenInput,
  goalUpdateAfterware,
  checkDocExistence,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { GoalService } }) =>
  GoalService.linkFile(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkGoalAccess(),
  checkDocExistence((root, { fileId }, { collections: { Files } }) => ({
    query: { _id: fileId },
    collection: Files,
  })),
  goalUpdateAfterware(),
)(resolver);
