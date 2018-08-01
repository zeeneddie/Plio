import { applyMiddleware } from 'plio-util';
import { checkLoggedIn, flattenInput } from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.KeyPartnerService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  // TODO: refactor this after redesigning middleware
  async (next, root, args, context) => {
    const { collections: { Organizations, KeyPartners } } = context;
    const { _id } = args;
    const keyPartner = await KeyPartners.findOne({ _id });

    if (!keyPartner) throw new Error('Key partner does not exist');

    const { organizationId } = keyPartner;
    const organization = await Organizations.findOne({ _id: organizationId });

    if (!organization) throw new Error('You\'re not a member of this organization');

    return next(keyPartner, args, { ...context, organization });
  },
  async (next, root, args, context) => {
    await next(root, args, context);

    const { _id } = args;
    const { collections: { KeyPartners } } = context;
    const keyPartner = await KeyPartners.findOne({ _id });

    return keyPartner;
  },
)(resolver);
