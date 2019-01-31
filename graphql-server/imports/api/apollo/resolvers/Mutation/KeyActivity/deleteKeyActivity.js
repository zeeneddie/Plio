import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkKeyActivityAccess,
} from '../../../../../share/middleware';
import { Subscriptions, DocChangeKinds } from '../../../constants';

export const resolver = async (keyActivity, args, context) =>
  context.services.KeyActivityService.delete(args, { ...context, keyActivity });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkKeyActivityAccess(),
  async (next, keyActivity, args, context) => {
    await next(keyActivity, args, context);

    const { pubsub } = context;

    pubsub.publish(
      Subscriptions.KEY_ACTIVITY_CHANGED,
      {
        [Subscriptions.KEY_ACTIVITY_CHANGED]: {
          entity: keyActivity,
          kind: DocChangeKinds.DELETE,
        },
      },
    );

    return keyActivity;
  },
)(resolver);
