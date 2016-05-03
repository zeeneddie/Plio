import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import UserService from './user-service.js';
import { UserProfile } from './user-schema.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { checkUserId } from '../checkers.js';


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

  validate: UserProfile.validator(),

  run(doc) {
    const userId = this.userId;
    checkUserId(userId, 'Unauthorized user cannot update profile');

    const fields = {};

    _.each(doc, (val, name) => {
      fields[`profile.${name}`] = val;
    });

    return UserService.update(userId, fields);
  }
});

export const updateEmail = new ValidatedMethod({
  name: 'Users.updateEmail',

  validate: new SimpleSchema({
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    }
  }).validator(),

  run({ email }) {
    const userId = this.userId;
    checkUserId(userId, 'Unauthorized user cannot update email');

    const fields = {
      'emails.0.address': email,
      'emails.0.verified': false
    };

    return UserService.update(userId, fields);
  }
});
