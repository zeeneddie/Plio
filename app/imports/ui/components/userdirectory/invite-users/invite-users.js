import { Template } from 'meteor/templating';

Template.UserDirectory_InviteUsers.viewmodel({
  isInviting: false,
  inviteButtonText(){
    return this.isInviting() ? 'Inviting...' : 'Invite';
  }
  

});