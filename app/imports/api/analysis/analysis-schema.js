import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, idSchemaDoc } from '../schemas.js';
import { AnalysisStatuses } from '../constants.js';

const RequiredSchema = new SimpleSchema({
  nonConformityId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  executor: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  targetDate: {
    type: Date
  }
});

const OptionalSchema = new SimpleSchema({
  status: {
    type: Number,
    allowedValues: [0, 1],
    optional: true
  },
  completedAt: {
    type: Date,
    optional: true
  },
  completedBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  }
});

const AnalysisSchema = new SimpleSchema([
  BaseEntitySchema,
  RequiredSchema,
  OptionalSchema
]);

export { AnalysisSchema, RequiredSchema };
