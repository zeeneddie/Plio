import { Subscriptions, DocChangeKinds } from '../../subscriptions/constants';

export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { pubsub, collections: { ValuePropositions } } = context;

  await next(root, args, context);

  const valueProposition = await ValuePropositions.findOne({ _id });

  pubsub.publish(
    Subscriptions.VALUE_PROPOSITION_CHANGED,
    {
      [Subscriptions.VALUE_PROPOSITION_CHANGED]: {
        kind: DocChangeKinds.UPDATE,
        entity: valueProposition,
      },
    },
  );

  return valueProposition;
};
