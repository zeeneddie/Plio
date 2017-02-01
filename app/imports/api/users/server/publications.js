/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';

const getUsersCursor = (ids, query, projection) => {
  const _query = { _id: { $in: ids }, ...query };
  const _projection = { fields: Meteor.users.publicFields, ...projection };

  return Meteor.users.find(_query, _projection);
};

Meteor.publish(null, function publishCurrentUser() {
  return Meteor.users.find({ _id: this.userId });
});

Meteor.publish('organizationUsers', function publishOrganizationUsers(userIds) {
  return getUsersCursor(userIds);
});

Meteor.publish('organizationOnlineUsers', function publishOrganizationOnlineUsers(userIds) {
  return getUsersCursor(userIds, { status: 'online' });
});
