import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
  BaseEntitySchema, BaseProblemsRequiredSchema, BaseProblemsOptionalSchema,
  ImprovementPlanSchema, FileIdsSchema
} from '../schemas.js';
import { ProblemsStatuses, WorkflowTypes } from '../constants.js';

const RequiredSchema = BaseProblemsRequiredSchema;

const RootCauseAnalysisSchema = (() => {
  const getCausesDef = () => {
    return _(5).times(n => ({
      [`rootCauseAnalysis.cause${n+1}`]: {
        type: String,
        optional: true
      }
    }));
  };

  const CausesSchaema = new SimpleSchema(getCausesDef());

  return new SimpleSchema([
    {
      rootCauseAnalysis: {
        type: Object,
        defaultValue: {},
        optional: true
      }
    },
    CausesSchaema,
    FileIdsSchema
  ]);
})();

const OptionalSchema = new SimpleSchema([
  BaseProblemsOptionalSchema,
  RootCauseAnalysisSchema,
  {
    cost: {
      type: Number,
      optional: true
    },
    ref: {
      type: Object,
      defaultValue: {},
      optional: true
    },
    'ref.text': {
      type: String,
      max: 20,
      optional: true
    },
    'ref.url': {
      type: String,
      regEx: SimpleSchema.RegEx.Url,
      optional: true
    }
  }
]);


const NonConformitiesSchema = new SimpleSchema([
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
    },
    workflowType: {
      type: String,
      allowedValues: _.values(WorkflowTypes)
    }
  }
]);

const NonConformitiesUpdateSchema = new SimpleSchema([
  OptionalSchema,
  {
    title: {
      type: String,
      min: 1,
      max: 80,
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
    standardsIds: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      minCount: 1,
      optional: true
    }
  }
]);

export { NonConformitiesSchema, NonConformitiesUpdateSchema, RequiredSchema, OptionalSchema };
