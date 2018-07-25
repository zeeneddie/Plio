import { Template } from 'meteor/templating';
import { SUPPORT_FORUM_URL } from '../../../../api/constants';
import { DocumentsListSubs } from '../../../../startup/client/subsmanagers';

Template.Dashboard_Footer.viewmodel({
  mixin: ['modal', 'organization', 'roles'],
  async onInviteClick(e) {
    e.preventDefault();

    await import('../../userdirectory/includes/invite');

    this.modal().open({
      organizationId: this.organizationId(),
      template: 'UserDirectory_InviteUsers',
      _title: 'Invite users',
      submitCaption: 'Invite',
      submitCaptionOnSave: 'Inviting...',
      closeCaption: 'Cancel',
      variation: 'save',
    });
  },
  openAddNCModal() {
    DocumentsListSubs.subscribe('standardsList', this.organizationId());

    this.modal().open({
      _title: 'Nonconformity',
      template: 'NC_Create',
      variation: 'save',
    });
  },
  supportForumUrl() {
    return SUPPORT_FORUM_URL;
  },
});
