import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkCustomerRelationshipAccess,
} from '../../../../../share/middleware';
import { Subscriptions, DocChangeKinds } from '../../../constants';

export const resolver = async (customerRelationship, args, context) =>
  context.services.CustomerRelationshipService.delete(args, { ...context, customerRelationship });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkCustomerRelationshipAccess(),
  async (next, customerRelationship, args, context) => {
    await next(customerRelationship, args, context);

    const { pubsub } = context;

    pubsub.publish(
      Subscriptions.CUSTOMER_RELATIONSHIP_CHANGED,
      {
        [Subscriptions.CUSTOMER_RELATIONSHIP_CHANGED]: {
          entity: customerRelationship,
          kind: DocChangeKinds.DELETE,
        },
      },
    );

    return customerRelationship;
  },
)(resolver);
