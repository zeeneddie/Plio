import { Template } from 'meteor/templating';

import Sounds from '/imports/api/sounds.js';


Template.UserEdit_MainDetails.viewmodel({
  mixin: ['callWithFocusCheck'],
  avatarFile: null,
  isNotificationsEnabled: false,
  notificationSound: '',
  autorun() {
    if (this.notificationSound() && this.audio()) {
      // without setTimeout load() doesn't work in safari
      Meteor.setTimeout(() => this.audio().load(), 100);
    }
  },
  isPropChanged(propName, newVal) {
    const savedVal = this.templateInstance.data[propName];
    return newVal && newVal !== savedVal;
  },
  updateFirstName(e) {
    const firstName = this.getData().firstName;
    if (this.isPropChanged('firstName', firstName)) {
      this.callWithFocusCheck(e, () => {
        this.parent().updateProfile('firstName', firstName);
      });
    }
  },
  updateLastName(e) {
    const lastName = this.getData().lastName;
    if (this.isPropChanged('lastName', lastName)) {
      this.callWithFocusCheck(e, () => {
        this.parent().updateProfile('lastName', lastName);
      });
    }
  },
  updateInitials(e) {
    const initials = this.getData().initials;
    if (this.isPropChanged('initials', initials)) {
      this.callWithFocusCheck(e, () => {
        this.parent().updateProfile('initials', initials);
      });
    }
  },
  updateDescription(e) {
    const description = this.getData().description;
    if (this.isPropChanged('description', description)) {
      this.callWithFocusCheck(e, () => {
        this.parent().updateProfile('description', description);
      });
    }
  },
  updateAvatar() {
    this.parent().uploadAvatarFile(this);
  },
  updateEmail(e) {
    const email = this.getData().email;
    if (this.isPropChanged('email', email)) {
      this.callWithFocusCheck(e, () => {
        this.parent().updateEmail(email);
      });
    }
  },
  isEditable() {
    return this.parent().isEditable();
  },
  setNotifications() {
    this.parent().setNotifications(!this.isNotificationsEnabled());
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
  updateSound() {
    this.parent().setNotificationSound(this.notificationSound());
  },
  events: {
    'change #notification-sounds'(e, tpl) {
      this.updateSound();
    }
  },
  getData() {
    return {
      email: this.email(),
      firstName: this.firstName(),
      lastName: this.lastName(),
      initials: this.initials().toUpperCase(),
      description: this.description(),
      avatar: this.avatar()
    };
  }
});
