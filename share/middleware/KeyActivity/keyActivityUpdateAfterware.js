import { Subscriptions, DocChangeKinds } from '../../subscriptions/constants';

export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { pubsub, collections: { KeyActivities } } = context;

  await next(root, args, context);

  const keyActivity = await KeyActivities.findOne({ _id });

  pubsub.publish(
    Subscriptions.KEY_ACTIVITY_CHANGED,
    {
      [Subscriptions.KEY_ACTIVITY_CHANGED]: {
        kind: DocChangeKinds.UPDATE,
        entity: keyActivity,
      },
    },
  );

  return keyActivity;
};
