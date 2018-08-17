import { Template } from 'meteor/templating';
import { UserProfileHelp } from '/imports/api/help-messages.js';

Template.UserDirectory_Card_Read.viewmodel({
  share: 'search',
  mixin: ['user', 'organization', 'modal'],
  async openEditUserModal(e) {
    e.preventDefault();

    await import('../includes/edit');

    this.modal().open({
      template: 'UserDirectory_Card_Edit',
      _title: 'Edit User',
      helpText: UserProfileHelp.userProfile,
      userId: this.user()._id,
    });
  },
  noSearchResults() {
    return this.searchText() && !this.searchResult().array().length;
  },
});
