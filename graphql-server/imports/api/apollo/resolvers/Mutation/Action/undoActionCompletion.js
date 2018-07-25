import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkActionAccess,
  ensureCanUndoActionCompletion,
  actionUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { ActionService } }) =>
  ActionService.undoCompletion(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkActionAccess(),
  ensureCanUndoActionCompletion(),
  actionUpdateAfterware(),
)(resolver);
