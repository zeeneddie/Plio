import { Template } from 'meteor/templating';

import { UserRoles, UserRolesNames } from '/imports/share/constants.js';


Template.UserEdit_Roles.viewmodel({
  mixin: ['collapse'],
  roles() {
    return _.values(UserRoles);
  },
  userHasRole(role) {
    return _.contains(this.userRoles(), role);
  },
  isEditable() {
    return this.parent().isRolesEditable();
  },
  roleName(role) {
    return UserRolesNames[role];
  },
  updateRole(role) {
    this.parent().updateRole(role);
  },
  rolesCount() {
    return this.userRoles().length;
  }
});
