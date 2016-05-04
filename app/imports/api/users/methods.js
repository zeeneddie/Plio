import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import UserService from './user-service.js';
import { UserProfile } from './user-schema.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { checkUserId } from '../checkers.js';
import { IdSchema } from '../schemas';


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
