import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkKeyResourceAccess,
  keyResourceUpdateAfterware,
} from '../../../../../share/middleware';
import { CanvasUpdateMiddlewares } from '../../../../../share/middleware/constants';

export const resolver = async (root, args, context) =>
  context.services.KeyResourceService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkKeyResourceAccess(),
  ...CanvasUpdateMiddlewares,
  keyResourceUpdateAfterware(),
)(resolver);
