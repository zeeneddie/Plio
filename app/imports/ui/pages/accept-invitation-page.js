import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Organizations } from '../../api/organizations/organizations';
import { acceptInvitation } from '../../api/organizations/methods';


Template.AcceptInvitationPage.viewmodel({
  firstName: '',
  lastName: '',
  password: '',
  repeatPassword: '',
  invitationId: '',

  autorun() {
    let invitationId = FlowRouter.getParam('invitationId');
    this.invitationId(invitationId);
    this.templateInstance.subscribe('invitationInfo', invitationId);
  },

  invitedUser() {
    return Meteor.users.findOne();
  },

  organization() {
    return Organizations.findOne();
  },

  acceptInvitation() {
    let userData = this.data();
    if (userData.password === userData.repeatPassword) {
      delete userData.repeatPassword;
      delete userData.invitationId;

      //call accept invitation method

      console.log('data to submit', userData);

      acceptInvitation.call({
        invitationId: this.invitationId(),
        userData: userData
      }, (err, res) => {
        if (err) {
          alert(err);
        }
      });
    } else {
      alert('passwords should match');
    }
  }
});