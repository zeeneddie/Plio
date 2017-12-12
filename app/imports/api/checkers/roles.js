import { Roles } from 'meteor/alanning:roles';

import { UserRoles } from '../../share/constants';

export const canChangeStandards = (userId, organizationId) => Roles.userIsInRole(
  userId,
  UserRoles.CREATE_UPDATE_DELETE_STANDARDS,
  organizationId,
);

export const canChangeOrgSettings = (userId, organizationId) => Roles.userIsInRole(
  userId,
  UserRoles.CHANGE_ORG_SETTINGS,
  organizationId,
);

export const canInviteUsers = (userId, organizationId) => Roles.userIsInRole(
  userId,
  UserRoles.INVITE_USERS,
  organizationId,
);

export const canDeleteUsers = (userId, organizationId) => Roles.userIsInRole(
  userId,
  UserRoles.DELETE_USERS,
  organizationId,
);

export const canChangeRoles = (userId, organizationId) => Roles.userIsInRole(
  userId,
  UserRoles.EDIT_USER_ROLES,
  organizationId,
);
