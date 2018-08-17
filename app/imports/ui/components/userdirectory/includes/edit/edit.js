import { Template } from 'meteor/templating';
import { Slingshot } from 'meteor/edgee:slingshot';
import { Roles } from 'meteor/alanning:roles';
import { Random } from 'meteor/random';
import invoke from 'lodash.invoke';

import {
  updateProfile,
  unsetProfileProperty,
  updateEmail,
  updatePhoneNumber,
  addPhoneNumber,
  removePhoneNumber,
} from '/imports/api/users/methods.js';
import { removeUser } from '/imports/api/organizations/methods.js';
import { assignRole, revokeRole } from '/imports/api/users/methods.js';
import { UserUpdateProfileSchema } from '/imports/share/schemas/user-schema.js';
import { UserRoles } from '/imports/share/constants.js';
import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

Template.UserDirectory_Card_Edit.viewmodel({
  mixin: ['organization', 'modal'],
  firstName: '',
  lastName: '',
  initials: '',
  email: '',
  description: '',
  avatar: '',
  address: '',
  country: '',
  phoneNumbers: [],
  skype: '',
  autorun() {
    const user = this.user();
    if (user) {
      this.load({
        email: user.email(),
        firstName: user.firstName(),
        lastName: user.lastName(),
        initials: user.initials(),
        description: user.description(),
        avatar: user.avatar(),
        address: user.address(),
        country: user.country(),
        phoneNumbers: user.phoneNumbers(),
        skype: user.skype(),
        isNotificationsEnabled: user.isNotificationsEnabled,
        notificationSound: user.notificationSound,
      });
    }
  },
  user() {
    const userId = this.userId && this.userId();
    return Meteor.users.findOne({
      _id: userId,
    });
  },
  organizationId() {
    return this.organization() && this.organization()._id;
  },
  updateProfile(prop, val) {
    this.modal().callMethod(updateProfile, {
      _id: this.userId(),
      [prop]: val,
    });
  },
  unsetProfileProperty(prop) {
    this.modal().callMethod(unsetProfileProperty, {
      _id: this.userId(),
      fieldName: prop,
    });
  },
  updateEmail(email) {
    this.modal().callMethod(updateEmail, {
      _id: this.userId(),
      email,
    });
  },
  uploadAvatarFile(viewModel) {
    const avatarFile = viewModel.avatarFile();
    if (!avatarFile) {
      return;
    }

    const uploader = new Slingshot.Upload('userAvatars', {
      userId: this.userId(),
    });

    const modal = this.modal();
    modal.clearError();
    modal.isSaving(true);

    uploader.send(avatarFile, (err, downloadUrl) => {
      modal.isSaving(false);
      viewModel.avatarFile(null);

      if (err) {
        modal.setError(err);
        return;
      }

      this.modal().callMethod(updateProfile, {
        _id: this.userId(),
        avatar: downloadUrl,
      });
    });
  },
  updatePhoneNumber(viewModel, cb) {
    const { number, type } = viewModel.getData();
    const _id = viewModel._id();
    const userId = this.userId();

    this.modal().callMethod(updatePhoneNumber, {
      _id, userId, number, type,
    }, cb);
  },
  addPhoneNumber(viewModel, cb) {
    const { number, type } = viewModel.getData();
    const userId = this.userId();
    const _id = Random.id();

    if (_.isEmpty(number)) return;

    this.modal().callMethod(addPhoneNumber, {
      _id, userId, number, type,
    }, cb);
  },
  removePhoneNumber(viewModel, cb) {
    const _id = viewModel._id();
    const userId = this.userId();

    this.modal().callMethod(removePhoneNumber, { _id, userId }, cb);
  },
  isCurrentUser() {
    const userId = this.userId && this.userId();
    return Meteor.userId() === userId;
  },
  isUserOrgOwner() {
    const organization = this.organization();
    const ownerId = organization && organization.ownerId();
    return ownerId && (this.userId() === ownerId);
  },
  isEditable() {
    return this.isCurrentUser();
  },
  rolesLabel() {
    const user = this.user();
    if (user) {
      const userName = user.firstName() || user.lastName() || user.email();
      const orgName = this.organization() && this.organization().name;
      return `${userName}'s superpowers for ${orgName}:`;
    }
  },
  orgOwnerLabel() {
    const userId = this.userId();
    const user = this.user();
    const firstNameOrEmail = user && user.firstName() || 'This user';
    const organization = this.organization();

    if (userId && organization) {
      const orgName = organization.name;
      if (userId === organization.ownerId()) {
        return `${firstNameOrEmail} is the organization owner for organization ${orgName} and has the full set of superpowers`;
      }
    }
  },
  isRolesEditable() {
    return Roles.userIsInRole(
      Meteor.userId(),
      UserRoles.EDIT_USER_ROLES,
      this.organizationId(),
    ) && !this.isUserOrgOwner();
  },
  userHasRole(role) {
    return Roles.userIsInRole(this.userId && this.userId(), role, this.organizationId());
  },
  userRoles() {
    return _.filter(UserRoles, role => this.userHasRole(role));
  },
  updateRole(role) {
    const doc = {
      _id: this.userId(),
      organizationId: this.organizationId(),
      role,
    };

    if (this.userHasRole(role)) {
      this.modal().callMethod(revokeRole, doc);
    } else {
      this.modal().callMethod(assignRole, doc);
    }
  },
  isDeleteButtonEnabled() {
    const organization = this.organization();
    const userId = this.userId();

    if (userId === invoke(organization, 'ownerId')) {
      return false;
    }

    return Roles.userIsInRole(
      Meteor.userId(),
      UserRoles.DELETE_USERS,
      this.organizationId(),
    ) || this.isCurrentUser();
  },
  removeUserFn() {
    return this.removeUser.bind(this);
  },
  removeUser() {
    const user = this.user();
    const fullNameOrEmail = user && user.fullNameOrEmail() || 'This user';
    swal({
      title: 'Are you sure?',
      text: `${fullNameOrEmail} will be removed from the organization`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      closeOnConfirm: true,
    }, () => {
      this.modal().close();
      this.modal().callMethod(removeUser, {
        userId: this.userId(),
        organizationId: this.organizationId(),
      }, (err, res) => {
        if (!err) {
          FlowRouter.go('userDirectoryPage', {
            orgSerialNumber: this.organization().serialNumber,
          });

          // have to wait some time before opening new sweet alert
          Meteor.setTimeout(() => {
            swal({
              title: 'Removed!',
              text: `${fullNameOrEmail} has been removed from this organization`,
              type: 'success',
              timer: ALERT_AUTOHIDE_TIME,
              showConfirmButton: false,
            });
          }, 500);
        }
      });
    });
  },
});
