import { Meteor } from 'meteor/meteor';
import { Notifications } from '../notifications.js';

Meteor.publish(null, function() {
  const userId = this.userId;
  if (!userId) {
    return this.ready();
  }

  return Notifications.find({ recipientIds: this.userId });
});
