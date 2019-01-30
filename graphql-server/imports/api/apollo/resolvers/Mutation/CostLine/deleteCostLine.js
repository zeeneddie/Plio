import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkCostLineAccess,
} from '../../../../../share/middleware';
import { Subscriptions, DocChangeKinds } from '../../../constants';

export const resolver = async (costLine, args, context) =>
  context.services.CostLineService.delete(args, { ...context, costLine });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkCostLineAccess(),
  async (next, costLine, args, context) => {
    await next(costLine, args, context);

    const { pubsub } = context;

    pubsub.publish(
      Subscriptions.COST_LINE_CHANGED,
      {
        [Subscriptions.COST_LINE_CHANGED]: {
          entity: costLine,
          kind: DocChangeKinds.DELETE,
        },
      },
    );

    return costLine;
  },
)(resolver);
