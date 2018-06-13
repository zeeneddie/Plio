import { Template } from 'meteor/templating';

import { UserRoles } from '../../../../../share/constants';


Template.UserEdit_Roles.viewmodel({
  mixin: ['collapse'],

  isEditable() {
    return this.parent().isRolesEditable();
  },

  roles() {
    return Object.values(UserRoles);
  },

  rolesCount() {
    return this.userRoles().length;
  },
});
