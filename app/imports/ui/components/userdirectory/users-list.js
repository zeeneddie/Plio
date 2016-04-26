import { Template } from 'meteor/templating';

Template.UsersList.viewmodel({
  isActiveUser(userId) {
    return this.parent().activeUser() === userId;
  }
});