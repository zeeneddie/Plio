import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import OrganizationService from './organization-service';
import InvitationService from './invitation-service';

import { OrganizationEditableFields } from './organization-schema';
import { NCTypes } from '../constants';
import { IdSchema, TimePeriodSchema, OrganizationIdSchema, NewUserDataSchema } from '../schemas';
import { checkUserId } from '../checkers';


const nameSchema = new SimpleSchema({
  name: {type: String}
});

const ncTypeSchema = new SimpleSchema({
  ncType: {
    type: String,
    allowedValues: _.values(NCTypes)
  }
});

const updateErrorMessage = 'Unauthorized user cannot update an organization';

export const insert = new ValidatedMethod({
  name: 'Organizations.insert',
  validate: nameSchema.validator(),

  run({name}) {
    const userId = this.userId;

    checkUserId(
      userId, 'Unauthorized user cannot create an organization'
    );

    return OrganizationService.insert({
      name,
      ownerId: userId
    });
  }
});

export const update = new ValidatedMethod({
  name: 'Organizations.update',

  validate: new SimpleSchema([
    OrganizationEditableFields, IdSchema
  ]).validator(),

  run(doc) {
    checkUserId(this.userId, updateErrorMessage);

    return OrganizationService.update(doc);
  }
});

export const setName = new ValidatedMethod({
  name: 'Organizations.setName',

  validate: new SimpleSchema([
    IdSchema, nameSchema
  ]).validator(),

  run(doc) {
    checkUserId(this.userId, updateErrorMessage);

    return OrganizationService.setName(doc);
  }
});

export const setDefaultCurrency = new ValidatedMethod({
  name: 'Organizations.setDefaultCurrency',

  validate: new SimpleSchema([IdSchema, {
    currency: {type: String}
  }]).validator(),

  run(doc) {
    checkUserId(this.userId, updateErrorMessage);

    return OrganizationService.setDefaultCurrency(doc);
  }
});

export const setStepTime = new ValidatedMethod({
  name: 'Organizations.setStepTime',

  validate: new SimpleSchema([
    IdSchema, ncTypeSchema, TimePeriodSchema
  ]).validator(),

  run(doc) {
    checkUserId(this.userId, updateErrorMessage);

    return OrganizationService.setStepTime(doc);
  }
});

export const setReminder = new ValidatedMethod({
  name: 'Organizations.setReminder',

  validate: new SimpleSchema([
    IdSchema, ncTypeSchema, TimePeriodSchema,
    {
      reminderType: {
        type: String,
        allowedValues: ['interval', 'pastDue']
      }
    }
  ]).validator(),

  run(doc) {
    checkUserId(this.userId, updateErrorMessage);

    return OrganizationService.setReminder(doc);
  }
});

export const setGuideline = new ValidatedMethod({
  name: 'Organizations.setGuideline',

  validate: new SimpleSchema([
    IdSchema, ncTypeSchema,
    {
      text: {type: String}
    }
  ]).validator(),

  run(doc) {
    checkUserId(this.userId, updateErrorMessage);

    return OrganizationService.setGuideline(doc);
  }
});

export const inviteUserByEmail = new ValidatedMethod({
  name: 'Organizations.inviteUserByEmail',

  validate: new SimpleSchema([OrganizationIdSchema, {
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    },
    welcomeMessage: {
      type: String
    }
  }]).validator(),

  run({organizationId, email, welcomeMessage}) {
    if (this.isSimulation) {
      return;
    }

    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot invite users'
      );
    }
    //todo: check invite user permission here

    InvitationService.inviteUserByEmail(organizationId, email, welcomeMessage);
  }
});

export const acceptInvitation = new ValidatedMethod({
  name: 'Organizations.acceptInvitation',

  validate: new SimpleSchema({
    invitationId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    userData: {
      type: NewUserDataSchema
    }
  }).validator(),

  run({invitationId, userData}) {
    if (this.isSimulation) {
      return;
    }

    //no permission checks are required
    InvitationService.acceptInvitation(invitationId, userData);
  }
});


export const inviteMultipleUsersByEmail = new ValidatedMethod({
  name: 'Organizations.inviteMultipleUsers',

  validate: new SimpleSchema([OrganizationIdSchema, {
    emails: {
      type: [SimpleSchema.RegEx.Email]
    },
    welcomeMessage: {
      type: String
    }
  }]).validator(),

  run({organizationId, emails, welcomeMessage}) {
    if (this.isSimulation) {
      return;
    }

    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot invite users'
      );
    }
    //todo: check invite user permission here

    let errors = [];
    emails.forEach(email => {
      //aggregate service errors for each email
      try {
        InvitationService.inviteUserByEmail(organizationId, email, welcomeMessage)
      } catch (err) {
        errors.push(err.reason);
      }
    });

    if (errors.length > 0) {
      let errorMsg = `Failed to invite ${errors.length} user(s):\n${errors.join('.\n')}`;
      throw new Meteor.Error(500, errorMsg);
    }
  }
});
