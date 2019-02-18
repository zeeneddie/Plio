import { Subscriptions, DocChangeKinds } from '../../subscriptions/constants';

export default () => async (next, root, args, context) => {
  const { _id } = args;
  const { pubsub, collections: { CostLines } } = context;

  await next(root, args, context);

  const costLine = await CostLines.findOne({ _id });

  pubsub.publish(
    Subscriptions.COST_LINE_CHANGED,
    {
      [Subscriptions.COST_LINE_CHANGED]: {
        kind: DocChangeKinds.UPDATE,
        entity: costLine,
      },
    },
  );

  return costLine;
};
