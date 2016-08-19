/* Notification sound.
 *
 * Input parameters:
 * @param {boolean} notificationOnAdded - whether to send notifications when they are added;
*/
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

    if( this.isNotificationOnAdded() ){
      Notifications.find().observe({
        added: (doc) => {
          this.sendNotification(doc);
          updateViewedBy.call(doc._id);
        }
      });
    }
  },

  audio(){
    return this.templateInstance.find('#notification-sound');
  },
  isNotificationOnAdded(){
    return this.notificationOnAdded && this.notificationOnAdded();
  },
  playSound(){
    const audio = this.audio();

    audio && audio.play();
  }
});
