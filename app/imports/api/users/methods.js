import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Roles } from 'meteor/alanning:roles';

import UserService from './user-service.js';
import { UserProfile } from './user-schema.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { checkUserId } from '../checkers.js';
import { IdSchema } from '../schemas.js';
import { UserRoles } from '../constants.js';


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
    UserProfile
  ]).validator(),

  run({ _id, ...args}) {
    const userId = this.userId;
    checkUserId(userId, 'Unauthorized user cannot update profile');

    if (userId !== _id) {
      throw new Meteor.Error(403, 'User cannot update another user');
    }

    const fields = {};

    _.each(args, (val, name) => {
      fields[`profile.${name}`] = val;
    });

    return UserService.update(_id, fields);
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
    checkUserId(userId, 'Unauthorized user cannot update email');

    if (userId !== _id) {
      throw new Meteor.Error(403, 'User cannot update another user\'s email');
    }

    const fields = {
      'emails.0.address': email,
      'emails.0.verified': false
    };

    return UserService.update(_id, fields);
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
    userId, UserRoles.EDIT_USER_PERMISSIONS, orgId
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

    console.log('revoke');

    return Roles.removeUsersFromRoles(_id, role, organizationId);
  }
});
