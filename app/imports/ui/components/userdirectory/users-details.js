import { Template } from 'meteor/templating';

Template.UsersDetails.viewmodel({
  activeUser() {
    return this.parent().activeUser();
  }
});