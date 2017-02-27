import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
  BaseEntitySchema,
  BaseProblemsRequiredSchema,
  BaseProblemsOptionalSchema,
  FileIdsSchema,
} from './schemas';
import { ProblemsStatuses, RCAMaxCauses, WorkflowTypes } from '../constants';

const RequiredSchema = BaseProblemsRequiredSchema;

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
    },
  },
  FileIdsSchema,
]);

const OptionalSchema = new SimpleSchema([
  BaseProblemsOptionalSchema,
  {
    cost: {
      type: Number,
      optional: true,
    },
    ref: {
      type: Object,
      defaultValue: {},
      optional: true,
    },
    'ref.text': {
      type: String,
      max: 20,
      optional: true,
    },
    'ref.url': {
      type: String,
      regEx: SimpleSchema.RegEx.Url,
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
      allowedValues: Object.keys(ProblemsStatuses).map(key => parseInt(key, 10)),
      defaultValue: 1,
    },
    workflowType: {
      type: String,
      allowedValues: Object.values(WorkflowTypes),
    },
  },
]);

export { NonConformitiesSchema, RequiredSchema, OptionalSchema };
