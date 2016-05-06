import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Accounts } from 'meteor/accounts-base'

import UserService from './user-service.js';
import { Organizations } from '/imports/api/organizations/organizations.js';

export const update = new ValidatedMethod({
  name: 'Users.update',

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
    const orgExists = !!Organizations.findOne({ 'users.userId': userId, serialNumber: selectedOrganizationSerialNumber });
    if (!orgExists) {
      throw new Meteor.Error('not-found', 'Could not find selected organization.');
    }

    return UserService.update({ selectedOrganizationSerialNumber, userId });
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
