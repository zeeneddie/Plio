/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';

import { getUsersCursorByIdsAndOrgId } from '/imports/server/helpers/pub-helpers';
import { checkOrgMembership } from '/imports/api/checkers';

Meteor.publish(null, function publishCurrentUser() {
  return Meteor.users.find({ _id: this.userId });
});

Meteor.publish('organizationUsers', function publishOrganizationUsers(userIds, organizationId) {
  const userId = this.userId;

  checkOrgMembership(userId, organizationId);

  return getUsersCursorByIdsAndOrgId(userIds, organizationId);
});
