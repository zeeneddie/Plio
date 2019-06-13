import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkCustomerSegmentAccess,
} from '../../../../../share/middleware';
import { Subscriptions, DocChangeKinds } from '../../../../../share/subscriptions/constants';

export const resolver = async (customerSegment, args, context) =>
  context.services.CustomerSegmentService.delete(args, { ...context, customerSegment });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkCustomerSegmentAccess(),
  async (next, customerSegment, args, context) => {
    await next(customerSegment, args, context);

    const { pubsub } = context;

    pubsub.publish(
      Subscriptions.CUSTOMER_SEGMENT_CHANGED,
      {
        [Subscriptions.CUSTOMER_SEGMENT_CHANGED]: {
          entity: customerSegment,
          kind: DocChangeKinds.DELETE,
        },
      },
    );

    return customerSegment;
  },
)(resolver);
