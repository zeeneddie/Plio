import { Template } from 'meteor/templating';

import { UserRolesNames } from '/imports/share/constants.js';
import { UserProfileHelp } from '/imports/api/help-messages.js';


Template.UserEdit_Role.viewmodel({
  mixin: ['collapse'],

  userHasRole() {
    return _.contains(this.userRoles(), this.role());
  },

  roleName() {
    return UserRolesNames[this.role()];
  },

  updateRole() {
    this.parent().parent().updateRole(this.role());
  },

  helpText() {
    return UserProfileHelp[this.role()];
  },

  hideHelp(e) {
    const $a = this.templateInstance.$(e.currentTarget);

    this.templateInstance.$('.guidance-panel').collapse('hide');

    this.templateInstance.$('.btn-collapse').addClass('collapsed');
  },
});
