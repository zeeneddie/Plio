import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
  checkPercentOfRevenue,
  checkPercentOfProfit,
} from '../../../../../share/middleware';
import { Subscriptions, DocChangeKinds } from '../../../../../share/subscriptions/constants';

export const resolver = async (root, args, context) =>
  context.services.RevenueStreamService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  checkPercentOfRevenue(),
  checkPercentOfProfit(),
  async (next, root, args, context) => {
    const _id = await next(root, args, context);
    const { pubsub, collections: { RevenueStreams } } = context;
    const revenueStream = RevenueStreams.findOne({ _id });

    pubsub.publish(
      Subscriptions.REVENUE_STREAM_CHANGED,
      {
        [Subscriptions.REVENUE_STREAM_CHANGED]: {
          entity: revenueStream,
          kind: DocChangeKinds.INSERT,
        },
      },
    );

    return { revenueStream };
  },
)(resolver);
