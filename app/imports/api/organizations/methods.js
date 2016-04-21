import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import OrganizationService from './organization-service.js';
import { OrganizationEditableFields } from './organization-schema.js';
import { NCTypes } from '../constants.js';
import { IdSchema, TimePeriodSchema } from '../schemas.js';
import { checkUserId } from '../checkers.js';


const nameSchema = new SimpleSchema({
  name: { type: String }
});

const ncTypeSchema = new SimpleSchema({
  ncType: {
    type: String,
    allowedValues: _.values(NCTypes)
  }
});

const updMethodErrMessage = 'Unauthorized user cannot update an organization';

export const insert = new ValidatedMethod({
  name: 'Organizations.insert',

  validate: nameSchema.validator(),

  run({ name }) {
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
    checkUserId(this.userId, updMethodErrMessage);

    return OrganizationService.update(doc);
  }
});

export const setName = new ValidatedMethod({
  name: 'Organizations.setName',

  validate: new SimpleSchema([
    IdSchema, nameSchema
  ]).validator(),

  run(doc) {
    checkUserId(this.userId, updMethodErrMessage);

    return OrganizationService.setName(doc);
  }
});

export const setDefaultCurrency = new ValidatedMethod({
  name: 'Organizations.setDefaultCurrency',

  validate: new SimpleSchema([IdSchema, {
    currency: { type: String }
  }]).validator(),

  run(doc) {
    checkUserId(this.userId, updMethodErrMessage);

    return OrganizationService.setDefaultCurrency(doc);
  }
});

export const setStepTime = new ValidatedMethod({
  name: 'Organizations.setStepTime',

  validate: new SimpleSchema([
    IdSchema, ncTypeSchema, TimePeriodSchema
  ]).validator(),

  run(doc) {
    checkUserId(this.userId, updMethodErrMessage);

    return OrganizationService.setStepTime(doc);
  }
});

export const setReminder = new ValidatedMethod({
  name: 'Organizations.setReminder',

  validate: new SimpleSchema([
    IdSchema, ncTypeSchema, TimePeriodSchema,
    {
      remiderType: {
        type: String,
        allowedValues: ['interval', 'pastDue']
      }
    }
  ]).validator(),

  run(doc) {
    checkUserId(this.userId, updMethodErrMessage);

    return OrganizationService.setReminder(doc);
  }
});

export const setGuideline = new ValidatedMethod({
  name: 'Organizations.setGuideline',

  validate: new SimpleSchema([
    IdSchema, ncTypeSchema,
    {
      text: { type: String }
    }
  ]).validator(),

  run(doc) {
    checkUserId(this.userId, updMethodErrMessage);

    return OrganizationService.setGuideline(doc);
  }
});
