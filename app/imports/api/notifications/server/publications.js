import { Meteor } from 'meteor/meteor';
import { Notifications } from '/imports/share/collections/notifications.js';

Meteor.publish(null, function() {
  const userId = this.userId;
  if (!userId) {
    return this.ready();
  }

  return Notifications.find({
    recipientIds: this.userId,
    viewedBy: { $ne: this.userId },
    createdAt: {

      // Subscribe only to notifications that were created >60 seconds ago
      $gt: new Date(new Date().getTime() - 1000 * 60 * 1)
    }
  });
});
