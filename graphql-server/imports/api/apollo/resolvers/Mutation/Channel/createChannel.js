import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
} from '../../../../../share/middleware';
import { Subscriptions, DocChangeKinds } from '../../../../../share/subscriptions/constants';

export const resolver = async (root, args, context) =>
  context.services.ChannelService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  async (next, root, args, context) => {
    const _id = await next(root, args, context);
    const { pubsub, collections: { Channels } } = context;
    const channel = Channels.findOne({ _id });

    pubsub.publish(
      Subscriptions.CHANNEL_CHANGED,
      { [Subscriptions.CHANNEL_CHANGED]: { entity: channel, kind: DocChangeKinds.INSERT } },
    );

    return { channel };
  },
)(resolver);
