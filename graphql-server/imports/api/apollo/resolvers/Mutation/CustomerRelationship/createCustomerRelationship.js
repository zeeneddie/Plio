import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
} from '../../../../../share/middleware';
import { Subscriptions, DocChangeKinds } from '../../../constants';

export const resolver = async (root, args, context) =>
  context.services.CustomerRelationshipService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  async (next, root, args, context) => {
    const _id = await next(root, args, context);
    const { pubsub, collections: { CustomerRelationships } } = context;
    const customerRelationship = CustomerRelationships.findOne({ _id });

    pubsub.publish(
      Subscriptions.CUSTOMER_RELATIONSHIP_CHANGED,
      {
        [Subscriptions.CUSTOMER_RELATIONSHIP_CHANGED]: {
          entity: customerRelationship,
          kind: DocChangeKinds.INSERT,
        },
      },
    );

    return { customerRelationship };
  },
)(resolver);
