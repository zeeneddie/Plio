import { Template } from 'meteor/templating';

Template.UsersList.viewmodel({
  isActiveUser(userId) {
    return this.parent().activeUser() === userId;
  },

  onInviteClick(event) {
    console.log('invite users click', event);
    event && event.preventDefault();
    ModalManager.open('UserDirectory_InviteUsers');
  }
});