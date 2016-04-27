import { Template } from 'meteor/templating';
import {ModalManager} from 'meteor/trsdln:modals';

Template.UsersList.viewmodel({
  isActiveUser(userId) {
    return this.parent().activeUser() === userId;
  },

  onInviteClick(event) {
    console.log('invite users click', event);
    event && event.preventDefault();
    
  }
});