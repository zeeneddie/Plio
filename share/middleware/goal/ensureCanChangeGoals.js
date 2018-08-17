import { canChangeGoals } from '../../checkers/roles';
import Errors from '../../errors';

export default (
  getOrgId = (root, args, context) => context.doc.organizationId,
) => async (next, root, args, context) => {
  const organizationId = getOrgId(root, args, context);

  if (!canChangeGoals(organizationId, context.userId)) {
    throw new Error(Errors.GOAL_CANNOT_CHANGE);
  }

  return next(root, args, context);
};
