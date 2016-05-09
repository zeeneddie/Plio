import { Template } from 'meteor/templating';

import { UserRoles, UserRolesNames } from '/imports/api/constants.js';


Template.UserEdit_Superpowers.viewmodel({
  mixin: ['collapse'],
  roles() {
    return _.values(UserRoles);
  },
  userHasRole(role) {
    return this.parent().userHasRole(role);
  },
  isEditable() {
    return this.parent().isSuperpowersEditable();
  },
  roleName(role) {
    return UserRolesNames[role];
  },
  updateRole(role) {
    this.parent().updateRole(role);
  }
});
