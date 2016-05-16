import { Template } from 'meteor/templating';
import { Slingshot } from 'meteor/edgee:slingshot';
import { Roles } from 'meteor/alanning:roles';

import {
  updateProfile,
  updateEmail,
  updatePhoneNumber,
  addPhoneNumber
} from '/imports/api/users/methods.js';
import { removeUser } from '/imports/api/organizations/methods.js';
import { assignRole, revokeRole } from '/imports/api/users/methods.js';
import { UserRoles } from '/imports/api/constants.js';


Template.UserEdit.viewmodel({
  mixin: ['organization', 'modal'],
  user() {
    return Meteor.users.findOne({
      _id: this.userId()
    });
  },
  organizationId() {
    return this.organization() && this.organization()._id;
  },
  updateProfile(prop, viewModel) {
    if (this.isPropChanged(prop, viewModel)) {
      this.modal().callMethod(updateProfile, {
        _id: this.userId(),
        [prop]: viewModel.getData()[prop]
      });
    }
  },
  updateEmail(viewModel) {
    if (this.isPropChanged('email', viewModel)) {
      this.modal().callMethod(updateEmail, {
        _id: this.userId(),
        email: viewModel.getData().email
      });
    }
  },
  uploadAvatarFile(viewModel) {
    const avatarFile = viewModel.avatarFile();
    if (!avatarFile) {
      return;
    }

    const uploader = new Slingshot.Upload('usersAvatars');

    this.modal().clearError();
    this.modal().isSaving(true);

    uploader.send(avatarFile, (err, downloadUrl) => {
      this.modal().isSaving(false);
      viewModel.avatarFile(null);

      if (err) {
        this.modal().setError(err);
        return;
      }

      this.modal().callMethod(updateProfile, {
        _id: this.userId(),
        avatar: downloadUrl
      });
    });
  },
  updatePhoneNumber(viewModel) {
    const { number, type } = viewModel.getData();
    const index = viewModel.index();

    this.modal().callMethod(updatePhoneNumber, {
      _id: this.userId(),
      index, number, type
    });
  },
  addPhoneNumber(viewModel) {
    const { number, type } = viewModel.getData();

    this.modal().callMethod(addPhoneNumber, {
      _id: this.userId(),
      number, type
    }, (err) => {
      if (!err) {
        Blaze.remove(viewModel.templateInstance.view);
      }
    });
  },
  isPropChanged(propName, viewModel) {
    const val = viewModel.getData()[propName];
    const savedVal = viewModel.templateInstance.data[propName];

    return val && val !== savedVal;
  },
  isCurrentUser() {
    return Meteor.userId() === this.userId();
  },
  isEditable() {
    return this.isCurrentUser();
  },
  rolesTitle() {
    const user = this.user();
    if (user) {
      const userName = user.firstName() || user.lastName() || user.email();
      const orgName = this.organization() && this.organization().name;
      return `${userName}'s superpowers for ${orgName}`;
    }
  },
  isRolesEditable() {
    return Roles.userIsInRole(
      Meteor.userId(),
      UserRoles.EDIT_USER_ROLES,
      this.organizationId()
    );
  },
  userHasRole(role) {
    return Roles.userIsInRole(
      this.userId(), role, this.organizationId()
    );
  },
  userRoles() {
    return _.filter(UserRoles, (role) => {
      return this.userHasRole(role);
    });
  },
  updateRole(role) {
    const doc = {
      _id: this.userId(),
      organizationId: this.organizationId(),
      role
    };

    if (this.userHasRole(role)) {
      this.modal().callMethod(revokeRole, doc);
    } else {
      this.modal().callMethod(assignRole, doc);
    }
  },
  isDeleteButtonEnabled() {
    return Roles.userIsInRole(
      Meteor.userId(),
      UserRoles.DELETE_USERS,
      this.organizationId()
    ) || this.isCurrentUser();
  },
  removeUserFn() {
    return this.removeUser.bind(this);
  },
  removeUser() {
    swal({
      title: 'Are you sure?',
      text: 'This user will be removed from the organization',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      closeOnConfirm: true
    }, () => {
      this.modal().close();
      this.modal().callMethod(removeUser, {
        userId: this.userId(),
        organizationId: this.organizationId()
      }, (err, res) => {
        if (!err) {
          // have to wait some time before opening new sweet alert
          FlowRouter.go('userDirectoryPage', { 
            orgSerialNumber: this.organization().serialNumber 
          });
          Meteor.setTimeout(() => {
            swal('Removed', 'User has been removed', 'success');
          }, 500);
        }
      });
    });
  }
});
