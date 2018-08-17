import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import {
  setNotifications,
  setNotificationSound,
  setEmailNotifications,
} from '/imports/api/users/methods.js';
import Sounds from '/imports/api/sounds.js';


Template.UserPreferences.viewmodel({
  mixin: ['modal', 'notifications'],
  userId: '',
  areNotificationsEnabled: false,
  notificationSound: '',
  isPlayEnabled: true,
  autorun: [
    function loadUserPreferences() {
      const user = this.user();
      if (user) {
        const {
          areNotificationsEnabled,
          areEmailNotificationsEnabled,
          notificationSound,
        } = user.preferences || {};
        this.load({
          areNotificationsEnabled,
          notificationSound,
          areEmailNotificationsEnabled,
        });
      }
    },
    function loadAudio() {
      if (this.notificationSound() && this.audio()) {
        // without setTimeout load() doesn't work in safari
        Meteor.setTimeout(() => this.audio().load(), 100);
      }
    },
  ],
  user() {
    const userId = this.userId && this.userId();
    return Meteor.users.findOne({
      _id: userId,
    });
  },
  setNotifications(enabled) {
    this.modal().callMethod(setNotifications, {
      enabled,
      _id: this.userId(),
    });
  },
  setEmailNotifications(enabled) {
    this.modal().callMethod(setEmailNotifications, { enabled });
  },
  setNotificationSound(soundFile) {
    this.modal().callMethod(setNotificationSound, {
      _id: this.userId(),
      soundFile,
    });
  },
  updateNotifications() {
    this.setNotifications(!this.areNotificationsEnabled());
  },
  updateEmailNotifications() {
    this.setEmailNotifications(!this.areEmailNotificationsEnabled());
  },
  updateSound() {
    this.setNotificationSound(this.notificationSound());
  },
  audio() {
    return this.templateInstance.find('#audio');
  },
  playSound() {
    if (this.notificationSound()) {
      this.isPlayEnabled(false);
      this.audio().play();
    }
  },
  sounds() {
    return Sounds;
  },
  sendTestNotification() {
    this.sendNotification({
      title: 'Test notification',
      icon: '/p-logo-square.png',
    });
  },
  events: {
    'change #notification-sounds': function () {
      this.isPlayEnabled(true);
      this.updateSound();
    },
    'ended #audio': function () {
      this.isPlayEnabled(true);
    },
  },
});
