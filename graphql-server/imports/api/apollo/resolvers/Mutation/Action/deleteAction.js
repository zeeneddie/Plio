import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkActionAccess,
  actionUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, { _id }, { userId, services: { ActionService } }) =>
  ActionService.remove({ _id, deletedBy: userId });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkActionAccess(),
  actionUpdateAfterware(),
)(resolver);
