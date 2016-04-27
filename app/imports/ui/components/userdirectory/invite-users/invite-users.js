import { Template } from 'meteor/templating';

Template.UserDirectory_InviteUsers.viewmodel({
  save() {
    console.log('on save click');
  }
});