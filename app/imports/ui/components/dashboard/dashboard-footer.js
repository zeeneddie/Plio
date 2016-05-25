import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations';
import { Roles } from 'meteor/alanning:roles';

import { UserRoles } from '/imports/api/constants.js';

Template.DashboardFooter.viewmodel({
  mixin: ['modal', 'organization', 'roles'],
  onInviteClick(event) {
    event.preventDefault();
    let orgSerialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'));
    let organizationId = Organizations.findOne({serialNumber: orgSerialNumber})._id;
    this.modal().open({
      template: 'UserDirectory_InviteUsers',
      title: 'Invite users',
      submitCaption: 'Invite',
      submitCaptionOnSave: 'Inviting...',
      closeCaption: 'Cancel',
      variation: 'save',
      organizationId
    });
  }
});
