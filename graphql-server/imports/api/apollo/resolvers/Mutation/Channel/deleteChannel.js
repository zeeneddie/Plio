import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkChannelAccess,
} from '../../../../../share/middleware';
import { Subscriptions, DocChangeKinds } from '../../../../../share/subscriptions/constants';

export const resolver = async (channel, args, context) =>
  context.services.ChannelService.delete(args, { ...context, channel });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkChannelAccess(),
  async (next, channel, args, context) => {
    await next(channel, args, context);

    const { pubsub } = context;

    pubsub.publish(
      Subscriptions.CHANNEL_CHANGED,
      {
        [Subscriptions.CHANNEL_CHANGED]: {
          entity: channel,
          kind: DocChangeKinds.DELETE,
        },
      },
    );

    return channel;
  },
)(resolver);
