import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkActionAccess,
  ensureCanUndoActionVerification,
  actionUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { doc, services: { ActionService } }) =>
  ActionService.undoVerification(args, { doc });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkActionAccess(),
  ensureCanUndoActionVerification(),
  actionUpdateAfterware(),
)(resolver);
