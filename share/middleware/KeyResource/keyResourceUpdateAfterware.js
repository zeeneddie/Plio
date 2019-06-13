import { Subscriptions, DocChangeKinds } from '../../subscriptions/constants';

export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { pubsub, collections: { KeyResources } } = context;

  await next(root, args, context);

  const keyResource = await KeyResources.findOne({ _id });

  pubsub.publish(
    Subscriptions.KEY_RESOURCE_CHANGED,
    {
      [Subscriptions.KEY_RESOURCE_CHANGED]: {
        kind: DocChangeKinds.UPDATE,
        entity: keyResource,
      },
    },
  );

  return keyResource;
};
