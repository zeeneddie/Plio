import invariant from 'invariant';
import { noop } from 'plio-util';

import checkOrgMembership from './checkOrgMembership';

export default (config = () => ({})) => async (next, root, args, context) => {
  const { userIds, ...configuration } = await config(root, args, context);

  invariant(userIds, 'userIds required');

  await Promise.all(userIds.map(userId =>
    checkOrgMembership(() => ({ ...configuration, userId }))(noop, root, args, context)));

  return next(root, args, context);
};
