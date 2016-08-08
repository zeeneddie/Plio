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
      `It is certain`,
      `It is decidedly so`,
      `Without a doubt`,
      `Yes — definitely`,
      `You may rely on it`,
      `As I see it, yes`,
      `Most likely`,
      `Outlook good`,
      `Signs point to yes`,
      `Yes`,
      `Reply hazy, try again`,
      `Ask again later`,
      `Better not tell you now`,
      `Cannot predict now`,
      `Concentrate and ask again`,
      `Don’t count on it`,
      `My reply is no`,
      `My sources say no`,
      `Outlook not so good`,
      `Very doubtful`
    ];

    this.sendNotification({
      title: 'Test notification',
      body: Random.choice(quotes),
      icon: '/p-logo-magic-8.png'
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
