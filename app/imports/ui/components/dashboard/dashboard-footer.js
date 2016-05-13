import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations';
import { Roles } from 'meteor/alanning:roles';

import { UserRoles } from '/imports/api/constants.js';

Template.DashboardFooter.viewmodel({
  mixin: ['modal', 'organization'],
  organizationId() {
    return this.organization() && this.organization()._id;
  },
  canInviteUsers() {
    return Roles.userIsInRole(
      Meteor.userId(),
      UserRoles.INVITE_USERS,
      this.organizationId()
    );
  },
  onInviteClick(event) {
    event.preventDefault();
    let orgSerialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'));
    let organizationId = Organizations.findOne({serialNumber: orgSerialNumber})._id;
    this.modal().open({
      template: 'UserDirectory_InviteUsers',
      title: 'Invite users',
      submitCaption: 'Invite',
      variation: 'save',
      organizationId
    });
  }
});