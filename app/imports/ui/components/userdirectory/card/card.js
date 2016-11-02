import { Template } from 'meteor/templating';
import { UserRolesNames } from '/imports/share/constants.js';
import { UserProfileHelp } from '/imports/api/help-messages.js';

Template.UserDirectory_Card_Read.viewmodel({
  share: 'window',
  mixin: ['user', 'organization', 'modal', 'mobile'],

  openEditUserModal(e) {
    e.preventDefault();

    this.modal().open({
      template: 'UserDirectory_Card_Edit',
      _title: 'Edit User',
      helpText: UserProfileHelp.userProfile,
      userId: this.user()._id
    });
  }
});
