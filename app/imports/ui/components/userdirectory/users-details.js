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
      return `${this.userFullNameOrEmail(this.user())}'s superpowers for ${this.organization().name}`
    }
  },
  openEditUserModal(e) {
    e.preventDefault();
    ModalManager.open('UserEdit', {
      userId: this.user()._id
    });
  }
});
