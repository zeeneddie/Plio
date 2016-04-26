import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import OrganizationService from './organization-service.js';


export const insert = new ValidatedMethod({
  name: 'Organizations.insert',

  validate: new SimpleSchema({
    name: {type: String}
  }).validator(),

  run({name}) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create an organization'
      );
    }

    return OrganizationService.insert({
      name,
      ownerId: userId
    });
  }
});

export const inviteUserByEmail = new ValidatedMethod({
  name: 'Organizations.inviteUserByEmail',

  validate: new SimpleSchema({
    organizationId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    }
  }).validator(),

  run({organizationId, email}) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot invite users'
      );
    }
    //todo: check invite user permission here

    OrganizationService.inviteUserByEmail(organizationId, email);
  }
});

const userDataSchema = new SimpleSchema({
  firstName: {
    type: String,
    min: 1,
    max: 20
  },
  lastName: {
    type: String,
    min: 1,
    max: 20
  },
  password: {
    type: String,
    min: 6,
    max: 20
  }
});

export const acceptInvitation = new ValidatedMethod({
  name: 'Organizations.acceptInvitation',

  validate: new SimpleSchema({
    invitationId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    userData: {type: userDataSchema}
  }).validator(),

  run({invitationId, userData}) {
    //no permission checks are required
    OrganizationService.acceptInvitation(invitationId, userData);
  }
});
