import { Template } from 'meteor/templating';

import { setNotifications, setNotificationSound } from '/imports/api/users/methods.js';
import Sounds from '/imports/api/sounds.js';


Template.UserPreferences.viewmodel({
  mixin: ['modal'],
  userId: '',
  isNotificationsEnabled: false,
  notificationSound: '',
  autorun: [
    function() {
      const user = this.user();
      if (user) {
        const { isNotificationsEnabled, notificationSound } = user;
        this.load({ isNotificationsEnabled, notificationSound });
      }
    },
    function() {
      if (this.notificationSound() && this.audio()) {
        // without setTimeout load() doesn't work in safari
        Meteor.setTimeout(() => this.audio().load(), 100);
      }
    }
  ],
  user() {
    const userId = this.userId && this.userId();
    return Meteor.users.findOne({
      _id: userId
    });
  },
  setNotifications(enabled) {
    this.modal().callMethod(setNotifications, {
      _id: this.userId(),
      enabled
    });
  },
  setNotificationSound(soundFile) {
    this.modal().callMethod(setNotificationSound, {
      _id: this.userId(),
      soundFile
    });
  },
  updateNotifications() {
    this.setNotifications(!this.isNotificationsEnabled());
  },
  updateSound() {
    this.setNotificationSound(this.notificationSound());
  },
  audio() {
    return this.templateInstance.$('#audio')[0];
  },
  playSound() {
    if (this.notificationSound()) {
      this.audio().play();
    }
  },
  sounds() {
    return Sounds;
  },
  events: {
    'change #notification-sounds'(e, tpl) {
      this.updateSound();
    }
  }
});
