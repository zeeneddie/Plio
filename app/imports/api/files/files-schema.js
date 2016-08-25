import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { idSchemaDoc, BaseEntitySchema, OrganizationIdSchema, ProgressSchema } from '../schemas.js';

export const RequiredSchema = new SimpleSchema([
  OrganizationIdSchema,
  {
    name: {
      type: String
    },
    extension: {
      type: String
    }
  }
]);

export const FilesSchema = new SimpleSchema([
  BaseEntitySchema,
  RequiredSchema,
  ProgressSchema,
  {
    url: {
      type: String,
      optional: true
    }
  }
]);
