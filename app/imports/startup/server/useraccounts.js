import { Roles } from 'meteor/alanning:roles';

import OrganizationService from '/imports/api/organizations/organization-service.js';
import { OrgOwnerRoles } from '/imports/api/constants.js';


function postSignUpHook(userId, info) {
  const orgName = info.profile.organizationName || 'My Organization';
  const orgTimezone = info.profile.organizationTimezone || 'Europe/London';

  let orgId;
  try {
    orgId = OrganizationService.insert({
      name: orgName,
      timezone: orgTimezone,
      ownerId: userId
    });
  } catch(err) {
    Meteor.users.remove({ _id: userId });
    throw err;
  }

  Roles.addUsersToRoles(userId, OrgOwnerRoles, orgId);

  Meteor.users.update({
    _id: userId
  }, {
    $unset: {
      'profile.organizationName': '',
      'profile.organizationTimezone': ''
    }
  });
}

AccountsTemplates.configure({
  postSignUpHook
});
