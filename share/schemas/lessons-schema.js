import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
  BaseEntitySchema,
  OrganizationIdSchema,
  DocumentIdSchema,
  DocumentTypeSchema,
  ViewedBySchema,
} from './schemas';

import { StringLimits } from '../constants';

const RequiredSchema = new SimpleSchema({
  title: {
    type: String,
    min: StringLimits.title.min,
    max: StringLimits.title.max,
  },
  date: {
    type: Date,
  },
  notes: {
    type: String,
    min: 1,
    max: StringLimits.markdown.max,
  },
  owner: {
    type: String,
    label: 'Created by',
    regEx: SimpleSchema.RegEx.Id,
  },
});

const LessonsSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationIdSchema,
  RequiredSchema,
  DocumentIdSchema,
  DocumentTypeSchema,
  ViewedBySchema,
  {
    serialNumber: {
      type: Number,
    },
  },
]);

export { RequiredSchema, LessonsSchema };
