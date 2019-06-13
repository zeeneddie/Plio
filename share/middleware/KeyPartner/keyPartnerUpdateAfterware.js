import { Subscriptions, DocChangeKinds } from '../../subscriptions/constants';

export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { pubsub, collections: { KeyPartners } } = context;

  await next(root, args, context);

  const keyPartner = await KeyPartners.findOne({ _id });

  pubsub.publish(
    Subscriptions.KEY_PARTNER_CHANGED,
    {
      [Subscriptions.KEY_PARTNER_CHANGED]: {
        kind: DocChangeKinds.UPDATE,
        entity: keyPartner,
      },
    },
  );

  return keyPartner;
};
