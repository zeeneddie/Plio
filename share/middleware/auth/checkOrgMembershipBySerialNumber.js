import invariant from 'invariant';

import { createOrgQueryWhereUserIsMember } from '../../mongo';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  const { serialNumber } = args;
  const { userId, collections: { Organizations } } = context;

  const organization = await Organizations.findOne({
    serialNumber,
    ...createOrgQueryWhereUserIsMember(userId),
  });

  invariant(organization, Errors.NOT_ORG_MEMBER);

  return next(root, args, { ...context, organization });
};
