import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations';

Template.UsersList.viewmodel({
  share: 'search',
  mixin: ['user'],
  isActiveUser(userId) {
    return this.parent().activeUser() === userId;
  },

  onInviteClick(event) {
    event.preventDefault();
    let orgSerialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'));
    let organizationId = Organizations.findOne({serialNumber: orgSerialNumber})._id;

    ModalManager.open('UserDirectory_InviteUsers', {organizationId: organizationId});
  }
});