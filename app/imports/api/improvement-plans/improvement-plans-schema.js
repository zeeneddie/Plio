import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, StandardIdSchema } from '../schemas.js';


const requiredSchema = new SimpleSchema([StandardIdSchema]);

const optionalSchema = new SimpleSchema({
  'desiredOutcome': {
    type: String,
    optional: true
  },
  'targetDate': {
    type: Date,
    optional: true
  },
  'reviewDates': {
    type: [Object],
    optional: true
  },
  'reviewDates.$.date': {
    type: Date
  },
  'reviewDates.$._id': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'owner': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  'selectedMetric': {
    type: String,
    optional: true
  },
  'currentValue': {
    type: String,
    optional: true
  },
  'targetValue': {
    type: String,
    optional: true
  },
  'files': {
    type: [Object],
    optional: true
  },
  'files.$._id': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'files.$.url': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  'files.$.name': {
    type: String
  }
});

const ImprovementPlansSchema = new SimpleSchema([
  BaseEntitySchema,
  requiredSchema,
  optionalSchema
]);

export { requiredSchema, optionalSchema, ImprovementPlansSchema };
