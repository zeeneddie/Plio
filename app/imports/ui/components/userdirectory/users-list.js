import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.UsersList.viewmodel({
  share: 'search',
  mixin: ['user', 'organization'],
  isActiveUser(userId) {
    return this.parent().activeUser() === userId;
  },

  getUserPath(userId) {
    return FlowRouter.path('userDirectoryUserPage', { 
      orgSerialNumber: this.parent().getCurrentOrganizationSerialNumber(), 
      userId: userId
    });
  },

  onInviteClick(event) {
    event.preventDefault();
    const orgSerialNumber = this.organization.serialNumber;
    const organizationId = Organizations.findOne({serialNumber: orgSerialNumber})._id;

    ModalManager.open('UserDirectory_InviteUsers', {organizationId: organizationId});
  }
});