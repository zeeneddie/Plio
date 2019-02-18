import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
} from '../../../../../share/middleware';
import { Subscriptions, DocChangeKinds } from '../../../../../share/subscriptions/constants';

export const resolver = async (root, args, context) =>
  context.services.KeyActivityService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  async (next, root, args, context) => {
    const _id = await next(root, args, context);
    const { pubsub, collections: { KeyActivities } } = context;
    const keyActivity = KeyActivities.findOne({ _id });

    pubsub.publish(
      Subscriptions.KEY_ACTIVITY_CHANGED,
      {
        [Subscriptions.KEY_ACTIVITY_CHANGED]: {
          entity: keyActivity,
          kind: DocChangeKinds.INSERT,
        },
      },
    );

    return { keyActivity };
  },
)(resolver);
