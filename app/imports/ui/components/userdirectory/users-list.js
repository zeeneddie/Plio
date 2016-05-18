import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';

import { UserRoles } from '/imports/api/constants.js';

Template.UsersList.viewmodel({
  share: 'search',
  mixin: ['user', 'organization', 'modal', 'roles'],
  isActiveUser(userId) {
    return this.parent().activeUser() === userId;
  },

  getUserPath(userId) {
    return FlowRouter.path('userDirectoryUserPage', {
      orgSerialNumber: this.parent().organizationSerialNumber(),
      userId: userId
    });
  },

  onInviteClick(event) {
    event.preventDefault();
    const serialNumber = this.parent().organizationSerialNumber();
    const organizationId = Organizations.findOne({ serialNumber })._id;

    this.modal().open({
      template: 'UserDirectory_InviteUsers',
      title: 'Invite users',
      submitCaption: 'Invite',
      variation: 'save',
      organizationId
    });
  }
});
