import { Template } from 'meteor/templating';

Template.UsersList.viewmodel({
  mixin: ['user'],
  isActiveUser(userId) {
    return this.parent().activeUser() === userId;
  }
});