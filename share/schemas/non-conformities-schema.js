import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
  BaseEntitySchema,
  BaseProblemsRequiredSchema,
  BaseProblemsOptionalSchema,
  FileIdsSchema,
  getNotifySchema,
} from './schemas';
import {
  ProblemsStatuses,
  RCAMaxCauses,
  WorkflowTypes,
  StringLimits,
  ProblemTypes,
} from '../constants';

const RequiredSchema = new SimpleSchema([
  BaseProblemsRequiredSchema,
  {
    type: {
      type: String,
      allowedValues: [
        ProblemTypes.NON_CONFORMITY,
        ProblemTypes.POTENTIAL_GAIN,
      ],
    },
  },
]);

const RootCauseAnalysisSchema = new SimpleSchema([
  {
    causes: {
      type: [Object],
      defaultValue: [],
      maxCount: RCAMaxCauses,
    },
    'causes.$.index': {
      type: Number,
      min: 1,
      max: RCAMaxCauses,
    },
    'causes.$.text': {
      type: String,
      optional: true,
    },
  },
  FileIdsSchema,
]);

const RefSchema = new SimpleSchema({
  text: {
    type: String,
    max: 20,
    optional: true,
  },
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    max: StringLimits.url.max,
    optional: true,
  },
});

const OptionalSchema = new SimpleSchema([
  BaseProblemsOptionalSchema,
  {
    cost: {
      type: Number,
      optional: true,
    },
    ref: {
      type: RefSchema,
      defaultValue: {},
      optional: true,
    },
    rootCauseAnalysis: {
      type: RootCauseAnalysisSchema,
      defaultValue: {},
      optional: true,
    },
  },
]);


const NonConformitiesSchema = new SimpleSchema([
  BaseEntitySchema,
  RequiredSchema,
  OptionalSchema,
  getNotifySchema(['ownerId', 'originatorId']),
  {
    serialNumber: {
      type: Number,
      min: 0,
    },
    sequentialId: {
      type: String,
      min: StringLimits.sequentialId.min,
      index: 1,
    },
    status: {
      type: Number,
      allowedValues: Object.keys(ProblemsStatuses).map(key => parseInt(key, 10)),
      defaultValue: 1,
      index: 1,
    },
    workflowType: {
      type: String,
      allowedValues: Object.values(WorkflowTypes),
    },
  },
]);

export { NonConformitiesSchema, RequiredSchema, OptionalSchema };
