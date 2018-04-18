import { Roles } from 'meteor/alanning:roles';
import { UserRoles } from '../../constants';

export default (userId, organizationId) => Roles.userIsInRole(
  userId,
  UserRoles.CHANGE_ORG_SETTINGS,
  organizationId,
);
