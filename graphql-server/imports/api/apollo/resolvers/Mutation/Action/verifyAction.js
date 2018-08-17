import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkActionAccess,
  ensureActionCanBeVerified,
  actionUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (
  root,
  { isVerifiedAsEffective: success, ...args },
  { userId, services: { ActionService } },
) => ActionService.verify({ ...args, success }, { userId });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkActionAccess(),
  ensureActionCanBeVerified(),
  actionUpdateAfterware(),
)(resolver);
