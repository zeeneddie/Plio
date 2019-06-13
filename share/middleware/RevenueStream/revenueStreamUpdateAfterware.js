import { Subscriptions, DocChangeKinds } from '../../subscriptions/constants';

export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { pubsub, collections: { RevenueStreams } } = context;

  await next(root, args, context);

  const revenueStream = await RevenueStreams.findOne({ _id });

  pubsub.publish(
    Subscriptions.REVENUE_STREAM_CHANGED,
    {
      [Subscriptions.REVENUE_STREAM_CHANGED]: {
        kind: DocChangeKinds.UPDATE,
        entity: revenueStream,
      },
    },
  );

  return revenueStream;
};
