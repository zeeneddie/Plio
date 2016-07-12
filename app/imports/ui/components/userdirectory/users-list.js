import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';

import { UserRoles } from '/imports/api/constants.js';

Template.UsersList.viewmodel({
  share: ['search', 'window'],
  mixin: ['user', 'organization', 'modal', 'roles', 'search'],
  autorun() {
    if (this.organizationUsers()) {
      const length = this.organizationUsers().fetch().length;
      this.searchResultsNumber(length);
    } else {
      this.searchResultsNumber(0);
    }
  },
  onInviteClick(event) {
    event.preventDefault();
    const serialNumber = this.organizationSerialNumber();
    const organizationId = Organizations.findOne({ serialNumber })._id;

    this.modal().open({
      template: 'UserDirectory_InviteUsers',
      _title: 'Invite users',
      submitCaption: 'Invite',
      submitCaptionOnSave: 'Inviting...',
      closeCaption: 'Cancel',
      variation: 'save',
      organizationId
    });
  }
});
