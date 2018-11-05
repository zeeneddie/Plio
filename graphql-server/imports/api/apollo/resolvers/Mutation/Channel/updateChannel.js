import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkChannelAccess,
  channelUpdateAfterware,
} from '../../../../../share/middleware';
import { CanvasUpdateMiddlewares } from '../../../../../share/middleware/constants';

export const resolver = async (root, args, context) =>
  context.services.ChannelService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkChannelAccess(),
  ...CanvasUpdateMiddlewares,
  channelUpdateAfterware(),
)(resolver);
