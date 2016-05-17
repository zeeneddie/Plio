import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const requiredSchema = new SimpleSchema({
  standardId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
});

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
    optional: true
  },
  'files.$.name': {
    type: String
  }
});

const ImprovementPlansSchema = new SimpleSchema([requiredSchema, optionalSchema]);

export { requiredSchema, optionalSchema, ImprovementPlansSchema };
