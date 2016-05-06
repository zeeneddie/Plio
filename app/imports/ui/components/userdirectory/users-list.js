import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.UsersList.viewmodel({
  share: 'search',
  mixin: ['user', 'organization', 'modal'],
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
    const orgSerialNumber = this.parent().getCurrentOrganizationSerialNumber();
    const organizationId = Organizations.findOne({serialNumber: orgSerialNumber})._id;

    this.modal().open({
      template: 'UserDirectory_InviteUsers',
      title: 'Invite users',
      submitCaption: 'Invite',
      variation: 'save',
      organizationId
    });
  }
});
