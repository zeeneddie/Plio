import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
  checkPercentOfMarketSize,
  checkCustomerSegmentMatchedToAccess,
} from '../../../../../share/middleware';
import { Subscriptions, DocChangeKinds } from '../../../constants';

export const resolver = async (root, args, context) =>
  context.services.CustomerSegmentService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  checkPercentOfMarketSize(),
  checkCustomerSegmentMatchedToAccess(),
  async (next, root, args, context) => {
    const _id = await next(root, args, context);
    const { pubsub, collections: { CustomerSegments } } = context;
    const customerSegment = CustomerSegments.findOne({ _id });

    pubsub.publish(
      Subscriptions.CUSTOMER_SEGMENT_CHANGED,
      {
        [Subscriptions.CUSTOMER_SEGMENT_CHANGED]: {
          entity: customerSegment,
          kind: DocChangeKinds.INSERT,
        },
      },
    );

    return { customerSegment };
  },
)(resolver);
