import { Template } from 'meteor/templating';
import { Organizations } from '/imports/share/collections/organizations';
import { Roles } from 'meteor/alanning:roles';

import { UserRoles } from '/imports/share/constants.js';
import { DocumentsListSubs } from '/imports/startup/client/subsmanagers.js';


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
    DocumentsListSubs.subscribe('standardsList', this.organizationId());
    this.modal().open({
      _title: 'Non-conformity',
      template: 'NC_Create',
      variation: 'save'
    });
  }
});
