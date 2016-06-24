import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
  BaseEntitySchema,
  OrganizationIdSchema,
  FileSchema,
  NotifySchema
} from '../schemas.js';
import { ActionTypes, ProblemTypes } from '../constants.js';


const linkedToSchema = new SimpleSchema({
  documentId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  documentType: {
    type: String,
    allowedValues: ProblemTypes
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
    status: {
      type: Number,
      min: 0,
      max: 9
    },
    linkedTo: {
      type: [linkedToSchema]
    },
    ownerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    isPlanInPlace: {
      type: Boolean,
      defaultValue: false
    },
    serialNumber: {
      type: Number,
      min: 1
    },
    sequentialId: {
      type: String,
      regEx: /^(?:CA|PA|RC)[1-9][0-9]*$/
    },
    isCompleted: {
      type: Boolean,
      defaultValue: false
    },
    completionTarget: {
      type: Date
    },
    toBeCompletedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    isVerified: {
      type: Boolean,
      defaultValue: false
    },
    isDeleted: {
      type: Boolean,
      defaultValue: false
    },
  }
]);

const ActionSchema = new SimpleSchema([
  BaseEntitySchema,
  RequiredSchema,
  NotifySchema,
  {
    completedAt: {
      type: Date,
      optional: true
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
    verificationTarget: {
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
      optional: true
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
