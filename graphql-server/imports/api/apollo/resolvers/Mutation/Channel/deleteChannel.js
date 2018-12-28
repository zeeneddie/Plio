import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkChannelAccess,
  deleteAfterware,
} from '../../../../../share/middleware';

export const resolver = async (channel, args, context) =>
  context.services.ChannelService.delete(args, { ...context, channel });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkChannelAccess(),
  deleteAfterware(async (root, args, context) => ({
    collection: context.collections.Channels,
  })),
)(resolver);
