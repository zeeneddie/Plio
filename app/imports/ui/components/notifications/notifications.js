import { Template } from 'meteor/templating';
import { Notifications } from '/imports/api/notifications/notifications.js';

window.Notifications = Notifications;

Template.Notifications.viewmodel({
  onRendered() {
    if (window.Notification) {
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    }

    Notifications.find().observe({
      added(doc) {
        const notificationSound = document.getElementById('notification-sound');
        notificationSound && notificationSound.play();

        let notification = new Notification(doc.title, {
          body: doc.body,
          silent: true
        });
        if (doc.url) {
          notification.onclick = function () {
            window.open(doc.url);
          };
        }
      }
    })
  }
});
