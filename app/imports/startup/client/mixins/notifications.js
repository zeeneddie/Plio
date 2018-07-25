import { Meteor } from 'meteor/meteor';
import invoke from 'lodash.invoke';

export default {
  // Notifications document can be passed as an argument
  // _id is used as notification tag if there's no tag argument passed
  // Only title is required
  sendNotification({
    _id,
    title,
    body,
    tag,
    icon,
    url,
    silent = true,
    timeout = 6000,
  }) {
    const notification = new Notification(title, {
      body,
      tag: tag || _id,
      icon: icon || '/p-logo-square.png',
      silent,
    });

    if (Notification.permission === 'granted') {
      const notificationSound = document.getElementById('notification-sound');

      if (notificationSound) {
        notificationSound.currentTime = 0;
        notificationSound.play();
      }
    }

    if (url) {
      notification.onclick = function () {
        window.open(url);
      };
    }

    Meteor.setTimeout(() => {
      notification.close();
    }, timeout);
  },
  playNewMessageSound() {
    const sound = document.getElementById('message-sound');

    if (sound) {
      sound.currentTime = 0;
      invoke(sound, 'play');
    }
  },
};
