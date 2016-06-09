import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema } from '../schemas.js';
import { ProblemTypes, NCStatuses, OrgCurrencies } from '../constants.js';

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
  description: {
    type: String,
    optional: true
  },
  cost: {
    type: Number,
    optional: true
  },
  ref: {
    type: Object,
    optional: true
  },
  'ref.text': {
    type: String,
    max: 20
  },
  'ref.url': {
    type: String,
    regEx: SimpleSchema.RegEx.Url
  }
});

const ProblemsSchema = new SimpleSchema([
  OrganizationIdSchema,
  BaseEntitySchema,
  requiredFields,
  optionalFields,
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
      allowedValues: _.keys(NCStatuses).map(key => parseInt(key, 10)),
      defaultValue: 1
    }
  }
]);

const ProblemsUpdateSchema = new SimpleSchema([
  optionalFields,
  {
    type: {
      type: String,
      allowedValues: ProblemTypes,
      optional: true
    },
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
    }
  }
]);

export { ProblemsSchema, ProblemsUpdateSchema, requiredFields, optionalFields };
