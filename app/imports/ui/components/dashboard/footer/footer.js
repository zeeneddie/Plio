import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations';
import { Roles } from 'meteor/alanning:roles';

import { UserRoles } from '/imports/api/constants.js';

Template.Dashboard_Footer.viewmodel({
  mixin: ['modal', 'organization', 'roles'],
  onInviteClick(e) {
    e.preventDefault();
    
    this.modal().open({
      organizationId: this.organizationId(),
      template: 'UserDirectory_InviteUsers',
      _title: 'Invite users',
      submitCaption: 'Invite',
      submitCaptionOnSave: 'Inviting...',
      closeCaption: 'Cancel',
      variation: 'save'
    });
  },
  openAddNCModal() {
    this.templateInstance.subscribe('standards', this.organizationId());
    this.modal().open({
      _title: 'Non-conformity',
      template: 'NC_Create',
      variation: 'save'
    });
  }
});