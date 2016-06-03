import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema } from '../schemas.js';
import { ProblemTypes } from '../constants.js';

const requiredFields = new SimpleSchema([
  OrganizationIdSchema,
  {
    type: {
      type: String,
      allowedValues: ProblemTypes
    },
    title: {
      type: String,
      min: 1,
      max: 40
    },
    identifiedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    identifiedAt: {
      type: Date
    },
    magnitude: {
      type: String
    }
  }
]);

const optionalFields = new SimpleSchema({
  standards: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
});

const ProblemsSchema = new SimpleSchema([
  OrganizationIdSchema,
  BaseEntitySchema,
  requiredFields,
  {
    serialNumber: {
      type: Number,
      min: 0
    },
    sequentialId: {
      type: String,
      min: 3
    }
  }
]);

export { ProblemsSchema, requiredFields, optionalFields };
