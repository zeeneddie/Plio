import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
  BaseEntitySchema,
  OrganizationIdSchema,
  FileSchema,
  NotifySchema
} from '../schemas.js';
import { ActionTypes, ActionPlanOptions, ProblemTypes } from '../constants.js';
import { compareDates } from '../helpers.js';


const checkDate = function() {
  const value = this.value;
  if (!_.isDate(value)) {
    return;
  }

  return (compareDates(value, new Date()) > -1) ? 'badDate' : true;
};

const linkedProblemSchema = new SimpleSchema({
  problemId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  problemType: {
    type: String,
    allowedValues: _.values(ProblemTypes)
  }
});

const RequiredSchema = new SimpleSchema([
  OrganizationIdSchema,
  {
    title: {
      type: String,
      min: 1,
      max: 40
    },
    type: {
      type: String,
      allowedValues: _.values(ActionTypes)
    },
    linkedStandardsIds: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      minCount: 1
    },
    linkedProblems: {
      type: [linkedProblemSchema],
      minCount: 1
    },
    ownerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    planInPlace: {
      type: String,
      allowedValues: _.values(ActionPlanOptions)
    },
    completionTargetDate: {
      type: Date
    },
    toBeCompletedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }
]);

const ActionSchema = new SimpleSchema([
  BaseEntitySchema,
  RequiredSchema,
  NotifySchema,
  {
    serialNumber: {
      type: Number,
      min: 1
    },
    sequentialId: {
      type: String,
      regEx: /^(?:CA|PA|RC)[1-9][0-9]*$/
    },
    status: {
      type: Number,
      min: 0,
      max: 9,
      defaultValue: 0
    },
    isCompleted: {
      type: Boolean,
      defaultValue: false
    },
    completedAt: {
      type: Date,
      optional: true,
      custom: checkDate
    },
    completedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    completionResult: {
      type: String,
      max: 40,
      optional: true
    },
    isVerified: {
      type: Boolean,
      defaultValue: false
    },
    verificationTargetDate: {
      type: Date,
      optional: true
    },
    toBeVerifiedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    verifiedAt: {
      type: Date,
      optional: true,
      custom: checkDate
    },
    verifiedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    verificationResult: {
      type: String,
      max: 40,
      optional: true
    },
    isDeleted: {
      type: Boolean,
      defaultValue: false
    },
    deletedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    deletedAt: {
      type: Date,
      optional: true
    },
    notes: {
      type: String,
      optional: true
    },
    files: {
      type: [FileSchema],
      optional: true
    },
    viewedBy: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
      autoValue() {
        if (this.isInsert) {
          return [this.userId];
        }
      }
    }
  }
]);


export { RequiredSchema, ActionSchema };
