import { Roles } from 'meteor/alanning:roles';

import { UserRoles, UserRolesNames } from '/imports/api/constants.js';
import { assignRole, revokeRole } from '/imports/api/users/methods.js';


Template.UserEdit_Superpowers.viewmodel({
  mixin: ['editableModalSection', 'collapse'],
  roles() {
    return _.values(UserRoles);
  },
  userHasRole(role) {
    return Roles.userIsInRole(this.userId(), role, this.organizationId());
  },
  isEditable() {
    return Roles.userIsInRole(
      Meteor.userId(),
      UserRoles.EDIT_USER_ROLES,
      this.organizationId()
    );
  },
  roleName(role) {
    return UserRolesNames[role];
  },
  updateRole(role) {
    const doc = {
      _id: this.userId(),
      organizationId: this.organizationId(),
      role
    };

    if (this.userHasRole(role)) {
      this.callMethod(revokeRole, doc);
    } else {
      this.callMethod(assignRole, doc);
    }
  }
});
