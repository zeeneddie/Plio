import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkKeyPartnerAccess,
} from '../../../../../share/middleware';
import { Subscriptions, DocChangeKinds } from '../../../constants';

export const resolver = async (keyPartner, args, context) =>
  context.services.KeyPartnerService.delete(args, { ...context, keyPartner });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkKeyPartnerAccess(),
  async (next, keyPartner, args, context) => {
    const { pubsub } = context;

    await next(keyPartner, args, context);

    pubsub.publish(
      Subscriptions.KEY_PARTNER_CHANGED,
      {
        [Subscriptions.KEY_PARTNER_CHANGED]: {
          entity: keyPartner,
          kind: DocChangeKinds.DELETE,
        },
      },
    );

    return keyPartner;
  },
)(resolver);
