import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';

import { setNotifications, setNotificationSound } from '/imports/api/users/methods.js';
import Sounds from '/imports/api/sounds.js';


Template.UserPreferences.viewmodel({
  mixin: ['modal', 'notifications'],
  userId: '',
  areNotificationsEnabled: false,
  notificationSound: '',
  isPlayEnabled: true,
  autorun: [
    function() {
      const user = this.user();
      if (user) {
        const { areNotificationsEnabled, notificationSound } = user.preferences || {};
        this.load({ areNotificationsEnabled, notificationSound });
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
    this.setNotifications(!this.areNotificationsEnabled());
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
    const quotes = [
      `If you don't like it - change it`,
      `We spend so much time looking - but never seeing`,
      `Let all these things just sort of happen`,
      `Be better than you were yesterday`,
      `This is your world`,
      `Now then, let's play`,
      `Use your imagination`
    ];

    this.sendNotification({
      title: 'Test notification',
      body: Random.choice(quotes),
    });
  },
  events: {
    'change #notification-sounds'(e, tpl) {
      this.isPlayEnabled(true);
      this.updateSound();
    },
    'ended #audio'() {
      this.isPlayEnabled(true);
    },
  }
});
