import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkKeyActivityAccess,
  keyActivityUpdateAfterware,
} from '../../../../../share/middleware';
import { CanvasUpdateMiddlewares } from '../../../../../share/middleware/constants';

export const resolver = async (root, args, context) =>
  context.services.KeyActivityService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkKeyActivityAccess(),
  ...CanvasUpdateMiddlewares,
  keyActivityUpdateAfterware(),
)(resolver);
