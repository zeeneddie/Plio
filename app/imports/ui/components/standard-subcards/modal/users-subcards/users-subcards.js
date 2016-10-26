import { Template } from 'meteor/templating';
import { Slingshot } from 'meteor/edgee:slingshot';
import { Roles } from 'meteor/alanning:roles';
import { Random } from 'meteor/random';
import invoke from 'lodash.invoke';

import { Organizations } from '/imports/share/collections/organizations.js';

import {
  updateProfile,
  unsetProfileProperty,
  updateEmail,
  updatePhoneNumber,
  addPhoneNumber,
  removePhoneNumber
} from '/imports/api/users/methods.js';
import { removeUser } from '/imports/api/organizations/methods.js';
import { assignRole, revokeRole } from '/imports/api/users/methods.js';
import { UserUpdateProfileSchema } from '/imports/share/schemas/user-schema.js';
import { UserRoles } from '/imports/share/constants.js';


Template.Users_Subcards.viewmodel({
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
        notificationSound: user.notificationSound
      });
    }
  },
  user() {
    const userId = this.UserId();
    return Meteor.users.findOne({
      _id: userId
    });
  },
  organizationId() {
    return this.organization() && this.organization()._id;
  },
  updateProfile(prop, val) {
    this.modal().callMethod(updateProfile, {
      _id: this.UserId(),
      [prop]: val
    });
  },
  organization() {
    return Organizations.findOne();
  },
  unsetProfileProperty(prop) {
    this.modal().callMethod(unsetProfileProperty, {
      _id: this.UserId(),
      fieldName: prop
    });
  },
  updateEmail(email) {
    this.modal().callMethod(updateEmail, {
      _id: this.UserId(),
      email
    });
  },
  uploadAvatarFile(viewModel) {
    const avatarFile = viewModel.avatarFile();
    if (!avatarFile) {
      return;
    }

    const uploader = new Slingshot.Upload('userAvatars', {
      userId: this.UserId()
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
        _id: this.UserId(),
        avatar: downloadUrl
      });
    });
  },
  updatePhoneNumber(viewModel, cb) {
    const { number, type } = viewModel.getData();
    const _id = viewModel._id();
    const userId = this.UserId();

    this.modal().callMethod(updatePhoneNumber, { _id, userId, number, type }, cb);
  },
  addPhoneNumber(viewModel, cb) {
    const { number, type } = viewModel.getData();
    const userId = this.UserId();
    const _id = Random.id();

    this.modal().callMethod(addPhoneNumber, { _id, userId, number, type }, cb);
  },
  removePhoneNumber(viewModel, cb) {
    const _id = viewModel._id();
    const userId = this.UserId();

    this.modal().callMethod(removePhoneNumber, { _id, userId }, cb);
  },
  isCurrentUser() {
    const userId = this.UserId();
    return Meteor.userId() === userId;
  },
  isUserOrgOwner() {
    const organization = this.organization();
    const ownerId = organization && organization.ownerId();
    return ownerId && (this.UserId() === ownerId);
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
    const userId = this.UserId();
    const organization = this.organization();

    if (userId && organization) {
      const orgName = organization.name;
      if (userId === organization.ownerId()) {
        return `Organization owner for organization "${orgName}"`;
      }
    }
  },
  isRolesEditable() {
    return Roles.userIsInRole(
      Meteor.userId(),
      UserRoles.EDIT_USER_ROLES,
      this.organizationId()
    ) && !this.isUserOrgOwner();
  },
  userHasRole(role) {
    return Roles.userIsInRole(
      this.UserId(), role, this.organizationId()
    );
  },
  userRoles() {
    return _.filter(UserRoles, (role) => {
      return this.userHasRole(role);
    });
  },
  updateRole(role) {
    const doc = {
      _id: this.UserId(),
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
    const organization = this.organization();
    const userId = this.UserId();

    if (userId === invoke(organization, 'ownerId')) {
      return false;
    }

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
        userId: this.UserId(),
        organizationId: this.organizationId()
      }, (err, res) => {
        if (!err) {
          FlowRouter.go('userDirectoryPage', {
            orgSerialNumber: this.organization().serialNumber
          });
          // have to wait some time before opening new sweet alert
          Meteor.setTimeout(() => {
            swal('Removed', 'User has been removed', 'success');
          }, 500);
        }
      });
    });
  }
});
