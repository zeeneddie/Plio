import invariant from 'invariant';

import { createOrgQueryWhereUserIsMember } from '../../mongo';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  const { userId, loaders: { Organization: { byQuery } } } = context;

  const isPlioMember = !!(await byQuery.load({
    isAdminOrg: true,
    ...createOrgQueryWhereUserIsMember(userId),
  })).length;

  invariant(isPlioMember, Errors.NOT_AUTHORIZED);

  return next(root, args, context);
};
