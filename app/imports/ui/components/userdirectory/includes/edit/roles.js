import { Template } from 'meteor/templating';

import { UserRoles } from '/imports/share/constants.js';


Template.UserEdit_Roles.viewmodel({
  mixin: ['collapse'],

  isEditable() {
    return this.parent().isRolesEditable();
  },

  roles() {
    return _.values(UserRoles);
  },

  rolesCount() {
    return this.userRoles().length;
  },
});
