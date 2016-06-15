import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema, DocumentIdSchema, DocumentTypeSchema } from '../schemas.js';


const RequiredSchema = new SimpleSchema({
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
});

const LessonsSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationIdSchema,
  RequiredSchema,
  DocumentIdSchema,
  DocumentTypeSchema,
  {
    serialNumber: {
      type: Number
    }
  }
]);

export { RequiredSchema, LessonsSchema };
