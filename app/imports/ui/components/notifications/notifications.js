import { Template } from 'meteor/templating';
import { Notifications } from '/imports/api/notifications/notifications.js';
import { updateViewedBy } from '/imports/api/notifications/methods.js';

Template.Notifications.viewmodel({
  mixin: ['notifications'],
  onRendered() {
    if (window.Notification) {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    }

    Notifications.find().observe({
      added: (doc) => {
        this.sendNotification(doc);
        updateViewedBy.call(doc._id);
      }
    })
  }
});
