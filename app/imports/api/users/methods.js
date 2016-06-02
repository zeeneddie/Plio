import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Accounts } from 'meteor/accounts-base'
import { Roles } from 'meteor/alanning:roles';

import UserService from './user-service.js';
import { UserProfileSchema, PhoneNumberSchema } from './user-schema.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { IdSchema, UserIdSchema } from '../schemas.js';
import { UserRoles } from '../constants.js';

export const remove = new ValidatedMethod({
  name: 'Users.remove',

  validate: new SimpleSchema({}).validator(),

  run({}) {
    const _id = this.userId;
    if (!_id) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot delete account'
      );
    }
    return UserService.remove({ _id });
  }
});

export const selectOrganization = new ValidatedMethod({
  name: 'Users.selectOrganization',

  validate: new SimpleSchema({
    selectedOrganizationSerialNumber: {
      type: Number
    }
  }).validator(),

  run({ selectedOrganizationSerialNumber }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot select organizations'
      );
    }
    const orgExists = !!Organizations.findOne({
      'users.userId': userId,
      serialNumber: selectedOrganizationSerialNumber
    });
    if (!orgExists) {
      throw new Meteor.Error('not-found', 'Could not find selected organization.');
    }

    return UserService.update(userId, {
      selectedOrganizationSerialNumber
    });
  }
});

export const updateProfile = new ValidatedMethod({
  name: 'Users.updateProfile',

  validate: new SimpleSchema([
    IdSchema,
    UserProfileSchema
  ]).validator(),

  run({ _id, ...args}) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update profile'
      );
    }

    if (userId !== _id) {
      throw new Meteor.Error(403, 'User cannot update another user');
    }

    return UserService.updateProfile(_id, args);
  }
});

export const updateEmail = new ValidatedMethod({
  name: 'Users.updateEmail',

  validate: new SimpleSchema([IdSchema, {
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    }
  }]).validator(),

  run({ _id, email }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update email'
      );
    }

    if (userId !== _id) {
      throw new Meteor.Error(403, 'User cannot update another user\'s email');
    }

    return UserService.updateEmail(_id, email);
  }
});

export const updatePhoneNumber = new ValidatedMethod({
  name: 'Users.updatePhoneNumber',

  validate: new SimpleSchema([
    UserIdSchema,
    PhoneNumberSchema
  ]).validator(),

  run({ userId, ...args }) {
    const currUserId = this.userId;
    if (!currUserId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update phone numbers'
      );
    }

    if (userId !== currUserId) {
      throw new Meteor.Error(
        403, 'User cannot update another user\'s phone numbers'
      );
    }

    return UserService.updatePhoneNumber({ userId, ...args });
  }
});

export const addPhoneNumber = new ValidatedMethod({
  name: 'Users.addPhoneNumber',

  validate: new SimpleSchema([
    UserIdSchema,
    PhoneNumberSchema
  ]).validator(),

  run({ userId, ...args }) {
    const currUserId = this.userId;
    if (!currUserId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot add phone numbers'
      );
    }

    if (userId !== currUserId) {
      throw new Meteor.Error(
        403, 'User cannot add phone numbers to another users'
      );
    }

    return UserService.addPhoneNumber({ userId, ...args });
  }
});

export const removePhoneNumber = new ValidatedMethod({
  name: 'Users.removePhoneNumber',

  validate: new SimpleSchema([
    UserIdSchema,
    IdSchema
  ]).validator(),

  run({ userId, ...args }) {
    const currUserId = this.userId;
    if (!currUserId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot remove phone numbers'
      );
    }

    if (userId !== currUserId) {
      throw new Meteor.Error(
        403, 'User cannot remove another user\'s phone numbers'
      );
    }

    return UserService.removePhoneNumber({ userId, ...args });
  }
});

const changeRoleSchema = new SimpleSchema([IdSchema, {
  organizationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  role: {
    type: String,
    allowedValues: _.values(UserRoles)
  }
}]);

const ensureUserCanChangeRoles = (userId, orgId) => {
  const canChangeRoles = Roles.userIsInRole(
    userId, UserRoles.EDIT_USER_ROLES, orgId
  );

  if (!canChangeRoles) {
    throw new Meteor.Error(
      403,
      'User is not authorized for changing user\'s permissions in this organization'
    );
  }
};

export const assignRole = new ValidatedMethod({
  name: 'Users.assignRole',

  validate: changeRoleSchema.validator(),

  run({ _id, organizationId, role }) {
    ensureUserCanChangeRoles(this.userId, organizationId);

    return Roles.addUsersToRoles(_id, role, organizationId);
  }
});

export const revokeRole = new ValidatedMethod({
  name: 'Users.revokeRole',

  validate: changeRoleSchema.validator(),

  run({ _id, organizationId, role }) {
    ensureUserCanChangeRoles(this.userId, organizationId);

    return Roles.removeUsersFromRoles(_id, role, organizationId);
  }
});

export const sendVerificationEmail = new ValidatedMethod({
  name: 'Users.sendVerificationEmail',
  validate: new SimpleSchema({}).validator(),
  run() {
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error(
        403, 'Cannot verify an email of an unauthorized user'
      );
    }

    if (!this.isSimulation) {
      return Accounts.sendVerificationEmail(userId);
    }
  }
});
