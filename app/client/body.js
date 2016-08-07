import { Template } from 'meteor/templating';
import { Notifications } from '/imports/api/notifications/notifications.js';

window.Notifications = Notifications;

Template.body.viewmodel({
  onRendered() {
    console.log('body rendered');
    if (window.Notification) {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    }

    Notifications.find().observe({
      added(doc) {
        console.log('notification added', doc);
        new Notification(doc.subject, {
          body: doc.body,
          silent: true
        });
      }
    })
  }
});
