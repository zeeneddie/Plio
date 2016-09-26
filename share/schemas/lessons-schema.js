import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
  BaseEntitySchema,
  OrganizationIdSchema,
  DocumentIdSchema,
  DocumentTypeSchema,
  ViewedBySchema
} from './schemas.js';


const RequiredSchema = new SimpleSchema({
  title: {
    type: String,
    min: 1
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
