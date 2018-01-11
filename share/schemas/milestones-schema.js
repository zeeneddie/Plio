import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
  BaseEntitySchema,
  getNotifySchema,
} from './schemas';
import { StringLimits, AllowedMilestoneLinkedDocTypes, MilestoneStatuses } from '../constants';

export const MilestonesSchema = new SimpleSchema([
  BaseEntitySchema,
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
    linkedTo: {
      type: [new SimpleSchema({
        documentId: {
          type: String,
          regEx: SimpleSchema.RegEx.Id,
        },
        documentType: {
          type: String,
          allowedValues: AllowedMilestoneLinkedDocTypes,
        },
      })],
    },
    status: {
      type: Number,
      allowedValues: Object.values(MilestoneStatuses),
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
  },
]);

export default MilestonesSchema;
