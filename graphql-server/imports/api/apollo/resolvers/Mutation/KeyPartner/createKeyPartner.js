import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
} from '../../../../../share/middleware';
import { Subscriptions, DocChangeKinds } from '../../../constants';

export const resolver = async (root, args, context) =>
  context.services.KeyPartnerService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  async (next, root, args, context) => {
    const _id = await next(root, args, context);
    const { pubsub, collections: { KeyPartners } } = context;
    const keyPartner = KeyPartners.findOne({ _id });

    pubsub.publish(
      Subscriptions.KEY_PARTNER_CHANGED,
      { [Subscriptions.KEY_PARTNER_CHANGED]: { entity: keyPartner, kind: DocChangeKinds.INSERT } },
    );

    return { keyPartner };
  },
)(resolver);
