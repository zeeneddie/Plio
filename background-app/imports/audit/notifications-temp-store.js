import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import NotificationSender from '/imports/share/utils/NotificationSender';


// Used for waiting for new notifications before sending them to a user
const NOTIFICATION_WAIT_TIME_MS = 5000;

// Delay between notifications for one user
const NOTIFICATION_DELAY_MS = 5000;

/**
 * Utility used for sending notifications to the users.
 *
 * The main goal of this tool is to provide capabilities to control sending.
 * For example, notifications can be sent with some delays or they can be grouped
 * into one big notification. It can be achieved by storing notifications in
 * memory for some period of time instead of immediately sending them to the users.
 *
 * At the moment it provides capability to send notifications to a user
 * with some delays instead of sending them all simultaneously.
 * In the future it can be extended to provide functionality for
 * sending one big notification that contains all recent changes
 * instead of separate notification for each event.
 */
const NotificationsTempStore = {

  /**
   * Holds info about notifications and IDs of users
   * that should receive these notifications
   * key - user's ID
   * value - array of objects with notification data
   */
  _notificationsMap: {},

  /**
   * Adds notifications data to temporary storage.
   * After info about notifications is added to temporary storage,
   * NotificationsTempStore will decide how and when
   * a notifications should be sent to a user.
   * @param {Array} notifications array of objects with notification data
   */
  addNotifications(notifications) {
    notifications.forEach(notification => this.addNotification(notification));
  },

  /**
   * Adds notification data to temporary storage
   * After info about notification is added to temporary storage,
   * NotificationsTempStore will decide how and when
   * a notification should be sent to a user.
   * @param {Object} notification object with notification data
   */
  addNotification(notification) {
    notification.recipients.forEach((receiverId) => {
      const userNotifications = this._notificationsMap[receiverId];

      if (_.isArray(userNotifications)) {
        userNotifications.push(notification);
      } else {
        this._notificationsMap[receiverId] = [notification];

        Meteor.setTimeout(() => {
          this._sendNotificationsToUser(receiverId);
        }, NOTIFICATION_WAIT_TIME_MS);
      }
    });
  },

  _sendNotificationsToUser(userId) {
    const user = Meteor.users.findOne({ _id: userId });
    const notifications = this._notificationsMap[userId];

    const sendNotification = () => {
      const notification = notifications.shift();
      this._sendNotificationToUser(notification, user);
    };

    sendNotification();

    const intervalId = Meteor.setInterval(() => {
      if (!notifications.length) {
        delete this._notificationsMap[userId];
        Meteor.clearInterval(intervalId);
        return;
      }

      sendNotification();
    }, NOTIFICATION_DELAY_MS);
  },

  _sendNotificationToUser(notification, user) {
    if (!user) return undefined;

    const {
      sendBoth,
      templateData: {
        unsubscribeUrl,
        ...templateData
      },
      ...args
    } = notification;

    const isUserOnline = user.status === 'online';
    const options = { recipients: user._id, templateData, ...args };

    if (unsubscribeUrl) {
      Object.assign(options.templateData, { unsubscribeUrl });
    }

    const sender = new NotificationSender(options);

    if (sendBoth) {
      return sender.sendAll();
    }

    return isUserOnline ? sender.sendOnSite() : sender.sendEmail();
  },

};

export default NotificationsTempStore;
