/* eslint-disable prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';

// const fields = {
//   _id: 1,
//   'emails.$.address': 1,
//   'profile.address': 1,
//   'profile.avatar': 1,
//   'profile.country': 1,
//   'profile.description': 1,
//   'profile.firstName': 1,
//   'profile.lastName': 1,
//   'profile.initials': 1,
//   'profile.phoneNumbers': 1,
//   'profile.skype': 1,
//   status: 1,
//   statusConnection: 1,
// };

Meteor.publish(null, function publishCurrentUser() {
  return Meteor.users.find({ _id: this.userId });
});

Meteor.publish('organizationUsers', function publishOrganizationUsers(userIds) {
  return Meteor.users.find({ _id: { $in: userIds } });
});

Meteor.publish('organizationOnlineUsers', function publishOrganizationOnlineUsers(userIds) {
  return Meteor.users.find({ _id: { $in: userIds }, status: 'online' });
});
