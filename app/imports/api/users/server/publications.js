import { Meteor } from 'meteor/meteor';

Meteor.publish(null, function() {
  return Meteor.users.find({ _id: this.userId });
});

Meteor.publish('organizationUsers', function (userIds) {
  return Meteor.users.find({ _id: {$in: userIds } });
});

Meteor.publish('organizationOnlineUsers', function (userIds) {
  return Meteor.users.find({ _id: {$in: userIds }, status: 'online' });
});