import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkActionAccess,
  ensureActionCanBeCompleted,
  actionUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { userId, services: { ActionService } }) =>
  ActionService.complete(args, { userId });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkActionAccess(),
  ensureActionCanBeCompleted(),
  actionUpdateAfterware(),
)(resolver);
