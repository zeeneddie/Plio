import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
} from '../../../../../share/middleware';
import { Subscriptions, DocChangeKinds } from '../../../constants';

export const resolver = async (root, args, context) =>
  context.services.KeyResourceService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  async (next, root, args, context) => {
    const _id = await next(root, args, context);
    const { pubsub, collections: { KeyResources } } = context;
    const keyResource = KeyResources.findOne({ _id });

    pubsub.publish(
      Subscriptions.KEY_RESOURCE_CHANGED,
      {
        [Subscriptions.KEY_RESOURCE_CHANGED]: {
          entity: keyResource,
          kind: DocChangeKinds.INSERT,
        },
      },
    );

    return { keyResource };
  },
)(resolver);
