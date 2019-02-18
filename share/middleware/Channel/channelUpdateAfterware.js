import { Subscriptions, DocChangeKinds } from '../../subscriptions/constants';

export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { pubsub, collections: { Channels } } = context;

  await next(root, args, context);

  const channel = await Channels.findOne({ _id });

  pubsub.publish(
    Subscriptions.CHANNEL_CHANGED,
    {
      [Subscriptions.CHANNEL_CHANGED]: {
        kind: DocChangeKinds.UPDATE,
        entity: channel,
      },
    },
  );

  return channel;
};
