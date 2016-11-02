import { Template } from 'meteor/templating';
import { UserRolesNames } from '/imports/share/constants.js';

Template.UserDirectory_Card_Read.viewmodel({
  mixin: ['user', 'organization', 'modal'],

  openEditUserModal(e) {
    e.preventDefault();

    this.modal().open({
      template: 'UserDirectory_Card_Edit',
      _title: 'Edit User',
      userId: this.user()._id
    });
  }
});
