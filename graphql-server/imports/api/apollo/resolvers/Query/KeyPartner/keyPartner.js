import { applyMiddleware } from 'plio-util';
import { objOf, identity, compose } from 'ramda';

import { checkLoggedIn } from '../../../../../share/middleware';

export const resolver = compose(objOf('keyPartner'), identity);

export default applyMiddleware(
  checkLoggedIn(),
  // TODO: refactor this after redesigning middleware
  async (next, root, args, context) => {
    const { collections: { KeyPartners, Organizations } } = context;
    const { _id } = args;
    const keyPartner = KeyPartners.findOne({ _id });

    if (!keyPartner) throw new Error('Key partner does not exist');

    const { organizationId } = keyPartner;
    const organization = await Organizations.findOne({ _id: organizationId });

    if (!organization) throw new Error('You\'re not a member of this organization');

    return next(keyPartner, args, { ...context, organization });
  },
)(resolver);
