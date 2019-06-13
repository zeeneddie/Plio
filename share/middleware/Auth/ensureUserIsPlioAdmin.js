import invariant from 'invariant';

import { createOrgQueryWhereUserIsOwner } from '../../mongo';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  const { userId, loaders: { Organization: { byQuery } } } = context;

  const isPlioAdmin = !!(await byQuery.load({
    isAdminOrg: true,
    ...createOrgQueryWhereUserIsOwner(userId),
  })).length;

  invariant(isPlioAdmin, Errors.NOT_AUTHORIZED);

  return next(root, args, context);
};
