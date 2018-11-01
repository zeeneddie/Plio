import { Roles } from 'meteor/alanning:roles';
import invariant from 'invariant';

export default (config = () => ({})) => async (next, root, args, context) => {
  const { userId = context.userId, organizationId, role } = await config(root, args, context);
  const { loaders: { Organization } } = context;

  invariant(
    userId && role,
    '[ensureUserIsInRole]: "userId" and "role" are required',
  );

  const isInRole = await Roles.userIsInRole(userId, role, organizationId);

  if (!isInRole) {
    let organization;

    if (organizationId) {
      organization = context.organization || (await Organization.byId.load(organizationId)) || {};
    }

    throw new Error(
      `[ensureUserIsInRole]: User is not in role: ${Array.isArray(role) ? role.join(', ') : role}` +
      `${organizationId ? `in the ${organization.name} organization` : ''}`,
    );
  }

  return next(root, args, context);
};
