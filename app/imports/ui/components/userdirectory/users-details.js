import { Template } from 'meteor/templating';

Template.UsersDetails.viewmodel({
  mixin: ['user', 'organization'],
  initials(user) {
    return user.profile.initials;
  },
  skype(user) {
    return user.profile.skype;
  },
  phoneNumbers(user) {
    return user.profile.phoneNumbers;
  },
  phoneType(type) {
    return `${type} phone`;
  },
  superpowersTitle(user) {
    if(this.organization()) {
      return `${this.userFullNameOrEmail(user)}'s superpowers for ${this.organization().name}`
    }
  },
  openEditUserModal(e) {
    e.preventDefault();
    ModalManager.open('UserEdit', {
      userId: this.user()._id
    });
  }
});
