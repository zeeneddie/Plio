import { Template } from 'meteor/templating';

Template.UsersDetails.viewmodel({
  mixin: ['user', 'organization'],
  initials() {
    return this.user().profile.initials;
  },
  skype() {
    return this.user().profile.skype;
  },
  phoneNumbers() {
    return this.user().profile.phoneNumbers;
  },
  phoneType(type) {
    return `${type} phone`;
  },
  superpowersTitle() {
    if(this.organization()) {
      return `${this.user().profile.firstName}'s superpowers for ${this.organization().name}`
    }
  }
});