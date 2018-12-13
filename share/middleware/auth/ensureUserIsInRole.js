import { Roles } from 'meteor/alanning:roles';
import invariant from 'invariant';

export default (config = () => ({})) => async (next, root, args, context) => {
  const { userId = context.userId, organizationId, role } = await config(root, args, context);

  invariant(userId && role, '"userId" and "role" are required');

  const isInRole = await Roles.userIsInRole(userId, role, organizationId);

  invariant(isInRole, `User is not in role: ${Array.isArray(role) ? role.join(', ') : role}`);

  return next(root, args, context);
};
