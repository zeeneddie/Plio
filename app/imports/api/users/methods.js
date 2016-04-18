import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import UserService from './user-service.js';
import { Organizations } from '/imports/api/organizations/organizations.js';

export const update = new ValidatedMethod({
  name: 'Users.update',

  validate: new SimpleSchema({
    selectedOrganizationSerialNumber: {
      type: String
    }
  }).validator(),

  run({ selectedOrganizationSerialNumber }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create an organization'
      );
    }
    const orgExists = !!Organizations.findOne({ 'users.userId': userId, serialNumber: selectedOrganizationSerialNumber });
    if (!orgExists) {
      throw new Meteor.Error('not-found', 'Could not find selected organization.');
    }

    return UserService.update({ selectedOrganizationSerialNumber });
  }
});
