/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';

import { getUsersCursorByIdsAndOrgId } from '/imports/server/helpers/pub-helpers';
import { isOrgMember } from '/imports/api/checkers';

Meteor.publish(null, function publishCurrentUser() {
  const query = { _id: this.userId };
  const options = {
    fields: {
      ...Meteor.users.publicFields,
      preferences: 1,
    },
  };
  return Meteor.users.find(query, options);
});

Meteor.publish('organizationUsers', function publishOrganizationUsers(userIds, organizationId) {
  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) return this.ready();

  return getUsersCursorByIdsAndOrgId(userIds, organizationId);
});
