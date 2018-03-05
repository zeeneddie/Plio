import { canChangeOrgSettings } from '../../checkers';
import Errors from '../../errors';

export default (
  getOrgId = (root, args) => args._id,
) => (next, root, args, context) => {
  const organizationId = getOrgId(root, args, context);

  if (!canChangeOrgSettings(context.userId, organizationId)) {
    throw new Error(Errors.ORG_CANNOT_CHANGE_SETTINGS);
  }

  return next(root, args, context);
};
