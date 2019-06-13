import { Subscriptions, DocChangeKinds } from '../../subscriptions/constants';

export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { pubsub, collections: { CustomerSegments } } = context;

  await next(root, args, context);

  const customerSegment = await CustomerSegments.findOne({ _id });

  pubsub.publish(
    Subscriptions.CUSTOMER_SEGMENT_CHANGED,
    {
      [Subscriptions.CUSTOMER_SEGMENT_CHANGED]: {
        kind: DocChangeKinds.UPDATE,
        entity: customerSegment,
      },
    },
  );

  return customerSegment;
};
