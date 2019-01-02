import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { pickNonInt } from 'plio-util';
import {
  BaseEntitySchema,
  getNotifySchema,
  OrganizationIdSchema,
  FileIdsSchema,
  DeletedSchema,
} from './schemas';
import { StringLimits, GoalPriorities, GoalStatuses, GoalColors } from '../constants';

const GoalSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationIdSchema,
  FileIdsSchema,
  DeletedSchema,
  getNotifySchema('ownerId'),
  {
    title: {
      type: String,
      min: StringLimits.title.min,
      max: StringLimits.title.max,
    },
    description: {
      type: String,
      optional: true,
      max: StringLimits.description.max,
    },
    serialNumber: {
      type: Number,
      min: 1,
    },
    sequentialId: {
      type: String,
      regEx: /^(?:KG)[1-9][0-9]*$/,
      min: StringLimits.sequentialId.min,
    },
    ownerId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    priority: {
      type: String,
      allowedValues: Object.values(GoalPriorities),
    },
    status: {
      type: Number,
      allowedValues: Object.values(pickNonInt(GoalStatuses)),
      defaultValue: 1,
    },
    statusComment: {
      type: String,
      optional: true,
      max: StringLimits.comments.max,
    },
    isCompleted: {
      type: Boolean,
      defaultValue: false,
    },
    completedAt: {
      type: Date,
      optional: true,
    },
    completedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
    completionComment: {
      type: String,
      optional: true,
      max: StringLimits.comments.max,
    },
    color: {
      type: String,
      allowedValues: Object.values(GoalColors),
    },
  },
]);

export default GoalSchema;
