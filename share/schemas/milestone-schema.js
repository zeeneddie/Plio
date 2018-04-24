import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { pickNonInt } from 'plio-util';

import {
  BaseEntitySchema,
  OrganizationIdSchema,
  DeletedSchema,
} from './schemas';
import { StringLimits, MilestoneStatuses } from '../constants';

export const MilestoneSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationIdSchema,
  DeletedSchema,
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
    status: {
      type: Number,
      allowedValues: Object.values(pickNonInt(MilestoneStatuses)),
      defaultValue: 1,
    },
    completionTargetDate: {
      type: Date,
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
    notify: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
  },
]);

export default MilestoneSchema;
