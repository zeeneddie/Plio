import invariant from 'invariant';

import { canChangeOrgSettings } from '../../checkers';
import Errors from '../../errors';

export default (config = () => ({})) => async (next, root, args, context) => {
  const {
    organizationId,
    errorMessage = Errors.ORG_CANNOT_CHANGE_SETTINGS,
  } = await config(root, args, context);

  invariant(organizationId, 'organizationId is required');

  const isAuthorized = await canChangeOrgSettings(context.userId, organizationId);

  invariant(isAuthorized, errorMessage);

  return next(root, args, context);
};
