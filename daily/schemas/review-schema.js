import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';
import moment from 'moment-timezone';

import {
  BaseEntitySchema,
  DocumentIdSchema,
  DocumentTypeSchema,
  OrganizationIdSchema,
  ViewedBySchema,
} from './schemas';

export const RequiredSchema = new SimpleSchema([
  DocumentIdSchema,
  DocumentTypeSchema,
  OrganizationIdSchema,
  {
    reviewedAt: {
      type: Date,
      label: 'Review date',
      custom() {
        const value = this.value;
        if (!_.isDate(value)) {
          return true;
        }

        return moment(value).isBefore(new Date()) ? true : 'badDate';
      },
    },
    reviewedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      label: 'Reviewer name',
    },
  },
]);

export const ReviewSchema = new SimpleSchema([
  BaseEntitySchema,
  RequiredSchema,
  ViewedBySchema,
  {
    comments: {
      type: String,
      max: 140,
      optional: true,
    },
    scheduledDate: {
      type: Date,
      optional: true,
    },
  },
]);
