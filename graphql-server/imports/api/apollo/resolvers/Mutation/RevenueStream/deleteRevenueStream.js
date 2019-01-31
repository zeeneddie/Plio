import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkRevenueStreamAccess,
} from '../../../../../share/middleware';
import { Subscriptions, DocChangeKinds } from '../../../constants';

export const resolver = async (root, args, context) =>
  context.services.RevenueStreamService.delete(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkRevenueStreamAccess(),
  async (next, revenueStream, args, context) => {
    await next(revenueStream, args, context);

    const { pubsub } = context;

    pubsub.publish(
      Subscriptions.REVENUE_STREAM_CHANGED,
      {
        [Subscriptions.REVENUE_STREAM_CHANGED]: {
          entity: revenueStream,
          kind: DocChangeKinds.DELETE,
        },
      },
    );

    return revenueStream;
  },
)(resolver);
