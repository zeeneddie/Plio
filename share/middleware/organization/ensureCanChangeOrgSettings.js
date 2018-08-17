import { canChangeOrgSettings } from '../../checkers';
import Errors from '../../errors';

export default ({
  getOrgId = (root, args) => args._id,
  error = Errors.ORG_CANNOT_CHANGE_SETTINGS,
} = {}) => async (next, root, args, context) => {
  const organizationId = await getOrgId(root, args, context);
  const isAuthorized = await canChangeOrgSettings(context.userId, organizationId);

  if (!isAuthorized) {
    throw new Error(error);
  }

  return next(root, args, context);
};
