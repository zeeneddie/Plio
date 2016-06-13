import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema, NotifySchema } from '../schemas.js';
import { NCStatuses, OrgCurrencies, AnalysisStatuses } from '../constants.js';

const RequiredSchema = new SimpleSchema([
  OrganizationIdSchema,
  {
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

const rootCaseAnalysis = {
  analysis: {
    type: Object,
    optional: true
  },
  'analysis.executor': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  'analysis.targetDate': {
    type: Date,
    optional: true
  },
  'analysis.status': {
    type: Number,
    allowedValues: _.keys(AnalysisStatuses),
    optional: true
  },
  'analysis.completedAt': {
    type: Date,
    optional: true
  },
  'analysis.completedBy': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  }
};

const OptionalSchema = new SimpleSchema([
  NotifySchema,
  {
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
    },
    departments: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    ...rootCaseAnalysis
  }
]);

const NonConformitiesSchema = new SimpleSchema([
  OrganizationIdSchema,
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
      allowedValues: _.keys(NCStatuses).map(key => parseInt(key, 10)),
      defaultValue: 1
    }
  }
]);

const NonConformitiesUpdateSchema = new SimpleSchema([
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
    }
  }
]);

export { NonConformitiesSchema, NonConformitiesUpdateSchema, RequiredSchema, OptionalSchema };
