import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { UserRoles } from '/imports/share/constants.js';

export default {
  canInviteUsers(organizationId) {
    const userId = Meteor.userId();

    if (userId && organizationId) {
      return Roles.userIsInRole(
        userId,
        UserRoles.INVITE_USERS,
        organizationId,
      );
    }
  },
  canCreateAndEditStandards(organizationId) {
    const userId = Meteor.userId();

    if (userId && organizationId) {
      return Roles.userIsInRole(
        userId,
        UserRoles.CREATE_UPDATE_DELETE_STANDARDS,
        organizationId,
      );
    }
  },
  canEditOrgSettings(organizationId) {
    const userId = Meteor.userId();

    if (userId && organizationId) {
      return Roles.userIsInRole(
        userId,
        UserRoles.CHANGE_ORG_SETTINGS,
        organizationId,
      );
    }
  },
};
