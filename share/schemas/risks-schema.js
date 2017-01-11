import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import {
  BaseEntitySchema,
  BaseProblemsRequiredSchema,
  BaseProblemsOptionalSchema,
  ReviewSchema,
  ImprovementPlanSchema,
  FileIdsSchema,
} from './schemas.js';
import {
  ProblemsStatuses,
  RiskEvaluationPriorities,
  RiskEvaluationDecisions,
  WorkflowTypes,
  StringLimits,
} from '../constants.js';


const RequiredSchema = new SimpleSchema([
  BaseProblemsRequiredSchema,
  FileIdsSchema,
  {
    typeId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  },
]);

const RiskScoreSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  rowId: {
    type: Number,
    label: 'Risk score',
  },
  value: {
    type: Number,
    min: 1,
    max: 100,
  },
  scoreTypeId: {
    type: String,
    label: 'Score type',
    max: 40,
  },
  scoredBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  scoredAt: {
    type: Date,
    label: 'Date',
  },
});

const RiskScoresSchema = new SimpleSchema({
  scores: {
    type: [RiskScoreSchema],
    defaultValue: [],
    optional: true,
  },
});

const riskEvaluation = {
  riskEvaluation: {
    type: Object,
    defaultValue: {},
    optional: true,
  },
  'riskEvaluation.comments': {
    type: String,
    max: 140,
    optional: true,
  },
  'riskEvaluation.prevLossExp': {
    type: String,
    max: 140,
    optional: true,
  },
  'riskEvaluation.priority': {
    type: String,
    allowedValues: _.keys(RiskEvaluationPriorities),
    optional: true,
  },
  'riskEvaluation.decision': {
    type: String,
    allowedValues: _.keys(RiskEvaluationDecisions),
    optional: true,
  },
};

const OptionalSchema = new SimpleSchema([
  BaseProblemsOptionalSchema,
  ReviewSchema,
  RiskScoresSchema,
  {
    type: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
    ...riskEvaluation,
  },
]);

const RisksSchema = new SimpleSchema([
  BaseEntitySchema,
  RequiredSchema,
  OptionalSchema,
  {
    serialNumber: {
      type: Number,
      min: 0,
    },
    sequentialId: {
      type: String,
      min: 3,
    },
    status: {
      type: Number,
      allowedValues: _.keys(ProblemsStatuses).map(key => parseInt(key, 10)),
      defaultValue: 1,
    },
    workflowType: {
      type: String,
      allowedValues: _.values(WorkflowTypes),
    },
  },
]);

const RisksUpdateSchema = new SimpleSchema([
  OptionalSchema,
  {
    title: {
      type: String,
      min: StringLimits.title.min,
      max: StringLimits.title.max,
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
    },
    standardsIds: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      minCount: 1,
      optional: true
    },
    improvementPlan: {
      type: ImprovementPlanSchema,
      optional: true
    }
  }
]);

export { RisksSchema, RisksUpdateSchema, RequiredSchema, OptionalSchema, RiskScoreSchema, RiskScoresSchema };
