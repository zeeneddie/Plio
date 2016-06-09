import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema, DocumentIdSchema, DocumentTypeSchema } from '../schemas.js';


export const requiredSchema = new SimpleSchema([DocumentIdSchema, DocumentTypeSchema, {
  title: {
    type: String
  },
  date: {
    type: Date
  },
  notes: {
    type: String
  },
  owner: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
}]);

export const LessonsSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationIdSchema,
  requiredSchema,
  {
    serialNumber: {
      type: Number
    }
  }
]);
