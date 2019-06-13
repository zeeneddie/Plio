import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import moment from 'moment-timezone';
import { _ } from 'meteor/underscore';

import {
  BaseEntitySchema,
  OrganizationIdSchema,
  FileIdsSchema,
  getNotifySchema,
  ViewedBySchema,
} from './schemas';
import {
  ActionTypes,
  ActionPlanOptions,
  ActionStatuses,
  StringLimits,
  AllowedActionLinkedDocTypes,
} from '../constants';


function checkDate() {
  const { value } = this;

  if (!_.isDate(value)) return false;

  return moment(value).isAfter(new Date()) ? 'badDate' : true;
}

const linkedToSchema = new SimpleSchema({
  documentId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    index: 1,
  },
  documentType: {
    type: String,
    allowedValues: AllowedActionLinkedDocTypes,
  },
});

const RequiredSchema = new SimpleSchema([
  OrganizationIdSchema,
  {
    title: {
      type: String,
      min: StringLimits.longTitle.min,
      max: StringLimits.longTitle.max,
    },
    description: {
      type: String,
      optional: true,
      // max: ?
    },
    type: {
      type: String,
      allowedValues: Object.values(ActionTypes),
    },
    linkedTo: {
      type: [linkedToSchema],
      optional: true,
      // maxCount: ?
    },
    ownerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    planInPlace: {
      type: String,
      allowedValues: Object.values(ActionPlanOptions),
      optional: true,
    },
    completionTargetDate: {
      type: Date,
    },
    toBeCompletedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  },
]);

const ActionSchema = new SimpleSchema([
  BaseEntitySchema,
  RequiredSchema,
  ViewedBySchema,
  FileIdsSchema,
  getNotifySchema('ownerId'),
  {
    serialNumber: {
      type: Number,
      min: 1,
    },
    sequentialId: {
      type: String,
      regEx: /^(?:CA|PA|RC|GA)[1-9][0-9]*$/,
      min: StringLimits.sequentialId.min,
    },
    status: {
      type: Number,
      allowedValues: Object.keys(ActionStatuses).map(key => parseInt(key, 10)),
      defaultValue: 1,
    },
    isCompleted: {
      type: Boolean,
      defaultValue: false,
    },
    completedAt: {
      type: Date,
      optional: true,
      custom: checkDate,
    },
    completedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
    completionComments: {
      type: String,
      optional: true,
      max: StringLimits.comments.max,
    },
    completionAssignedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
    isVerified: {
      type: Boolean,
      defaultValue: false,
    },
    isVerifiedAsEffective: {
      type: Boolean,
      defaultValue: false,
    },
    verificationTargetDate: {
      type: Date,
      optional: true,
    },
    toBeVerifiedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
    verifiedAt: {
      type: Date,
      optional: true,
      custom: checkDate,
    },
    verifiedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
    verificationComments: {
      type: String,
      optional: true,
      max: StringLimits.comments.max,
    },
    verificationAssignedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
    isDeleted: {
      type: Boolean,
      defaultValue: false,
    },
    deletedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
    deletedAt: {
      type: Date,
      optional: true,
    },
    notes: {
      type: String,
      optional: true,
    },
  },
]);

export { RequiredSchema, ActionSchema };
