import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkKeyResourceAccess,
} from '../../../../../share/middleware';
import { Subscriptions, DocChangeKinds } from '../../../../../share/subscriptions/constants';

export const resolver = async (keyResource, args, context) =>
  context.services.KeyResourceService.delete(args, { ...context, keyResource });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkKeyResourceAccess(),
  async (next, keyResource, args, context) => {
    await next(keyResource, args, context);

    const { pubsub } = context;

    pubsub.publish(
      Subscriptions.KEY_RESOURCE_CHANGED,
      {
        [Subscriptions.KEY_RESOURCE_CHANGED]: {
          entity: keyResource,
          kind: DocChangeKinds.DELETE,
        },
      },
    );

    return keyResource;
  },
)(resolver);
