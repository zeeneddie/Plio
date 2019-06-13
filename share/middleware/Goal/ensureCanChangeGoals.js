import invariant from 'invariant';

import { canChangeGoals } from '../../checkers/roles';
import Errors from '../../errors';

export default (config = () => ({})) => async (next, root, args, context) => {
  let { organizationId } = await config(root, args, context);

  if (!organizationId) ({ organizationId } = root);

  invariant(organizationId, 'organizationId is required');

  invariant(await canChangeGoals(organizationId, context.userId), Errors.GOAL_CANNOT_CHANGE);

  return next(root, args, context);
};
