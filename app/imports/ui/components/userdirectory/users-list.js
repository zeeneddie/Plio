import { Template } from 'meteor/templating';

Template.UsersList.viewmodel({
  isActiveUser(userId) {
    return this.parent().activeUser() === userId;
  },

  onInviteClick(event) {
    event.preventDefault();
    ModalManager.open('UserDirectory_InviteUsers');
  }
});