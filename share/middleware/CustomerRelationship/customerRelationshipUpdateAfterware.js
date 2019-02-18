import { Subscriptions, DocChangeKinds } from '../../subscriptions/constants';

export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { pubsub, collections: { CustomerRelationships } } = context;

  await next(root, args, context);

  const customerRelationship = await CustomerRelationships.findOne({ _id });

  pubsub.publish(
    Subscriptions.CUSTOMER_RELATIONSHIP_CHANGED,
    {
      [Subscriptions.CUSTOMER_RELATIONSHIP_CHANGED]: {
        kind: DocChangeKinds.UPDATE,
        entity: customerRelationship,
      },
    },
  );

  return customerRelationship;
};
