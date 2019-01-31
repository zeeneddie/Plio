import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
  checkPercentOfTotalCost,
} from '../../../../../share/middleware';
import { Subscriptions, DocChangeKinds } from '../../../constants';

export const resolver = async (root, args, context) =>
  context.services.CostLineService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  checkPercentOfTotalCost(),
  async (next, root, args, context) => {
    const _id = await next(root, args, context);
    const { pubsub, collections: { CostLines } } = context;
    const costLine = CostLines.findOne({ _id });

    pubsub.publish(
      Subscriptions.COST_LINE_CHANGED,
      { [Subscriptions.COST_LINE_CHANGED]: { entity: costLine, kind: DocChangeKinds.INSERT } },
    );

    return { costLine };
  },
)(resolver);
