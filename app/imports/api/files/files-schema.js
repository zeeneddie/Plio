import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { idSchemaDoc, BaseEntitySchema, OrganizationIdSchema } from '../schemas.js';

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
  {
    url: {
      type: String,
      optional: true
    },
    progress: {
      type: Number,
      decimal: true,
      min: 0,
      max: 1,
      defaultValue: 0
    }
  }
]);
