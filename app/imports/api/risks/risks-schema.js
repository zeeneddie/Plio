import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, BaseProblemsRequiredSchema, BaseProblemsOptionalSchema } from '../schemas.js';
import { ProblemsStatuses } from '../constants.js';

const RequiredSchema = new SimpleSchema([
  BaseProblemsRequiredSchema,
  {
    typeId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }
]);

const OptionalSchema = new SimpleSchema([
  BaseProblemsOptionalSchema,
  {
    type: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    score: {
      type: Object,
      optional: true
    },
    'score.rowId': {
      type: Number
    },
    'score.value': {
      type: Number,
      min: 1,
      max: 100
    },
    'score.scoredBy': {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    'score.scoredAt': {
      type: Date,
      optional: true
    }
  }
]);

const RisksSchema = new SimpleSchema([
  BaseEntitySchema,
  RequiredSchema,
  OptionalSchema,
  {
    serialNumber: {
      type: Number,
      min: 0
    },
    sequentialId: {
      type: String,
      min: 3
    },
    status: {
      type: Number,
      allowedValues: _.keys(ProblemsStatuses).map(key => parseInt(key, 10)),
      defaultValue: 1
    }
  }
]);

const RisksUpdateSchema = new SimpleSchema([
  OptionalSchema,
  {
    title: {
      type: String,
      min: 1,
      max: 40,
      optional: true
    },
    identifiedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    identifiedAt: {
      type: Date,
      optional: true
    },
    magnitude: {
      type: String,
      optional: true
    },
    typeId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    }
  }
]);

export { RisksSchema, RisksUpdateSchema, RequiredSchema, OptionalSchema };
