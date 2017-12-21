import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
  BaseEntitySchema,
  BaseProblemsRequiredSchema,
  BaseProblemsOptionalSchema,
  FileIdsSchema,
  getNotifySchema,
} from './schemas';
import { ProblemsStatuses, RCAMaxCauses, WorkflowTypes, StringLimits } from '../constants';

const PGAnalysisItem = new SimpleSchema({
  index: {
    type: Number,
    min: 1,
    max: RCAMaxCauses,
  },
  text: {
    type: String,
    optional: true,
  },
});

const PGAnalysis = new SimpleSchema([
  FileIdsSchema,
  {
    causes: {
      type: [PGAnalysisItem],
      defaultValue: [],
      maxCount: RCAMaxCauses,
    },
  },
]);

const PotentialGainsSchema = new SimpleSchema([
  BaseEntitySchema,
  BaseProblemsRequiredSchema,
  BaseProblemsOptionalSchema,
  getNotifySchema(['ownerId', 'originatorId']),
  {
    serialNumber: {
      type: Number,
      min: 0,
    },
    sequentialId: {
      type: String,
      min: StringLimits.sequentialId.min,
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
    cost: {
      type: Number,
      optional: true,
    },
    rootCauseAnalysis: {
      type: PGAnalysis,
      defaultValue: {},
      optional: true,
    },
  },
]);

export { PotentialGainsSchema };
