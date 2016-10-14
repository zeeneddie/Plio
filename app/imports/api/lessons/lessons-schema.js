import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
  BaseEntitySchema,
  OrganizationIdSchema,
  DocumentIdSchema,
  DocumentTypeSchema,
  ViewedBySchema
} from '../schemas.js';

import { StringLimits } from '/imports/api/constants.js';


const RequiredSchema = new SimpleSchema({
  title: {
    type: String,
    min: StringLimits.title.min,
    max: StringLimits.title.max
  },
  date: {
    type: Date
  },
  notes: {
    type: String,
    min: 1
  },
  owner: {
    type: String,
    label: 'Created by',
    regEx: SimpleSchema.RegEx.Id
  }
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
      type: Number
    }
  }
]);

export { RequiredSchema, LessonsSchema };
