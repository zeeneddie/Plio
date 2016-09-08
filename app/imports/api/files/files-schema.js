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

export const FileIdsSchema = new SimpleSchema([
  BaseEntitySchema,
  RequiredSchema,
  ProgressSchema,
  {
    url: {
      type: String,
      defaultValue: '',
      optional: true
    },

    // 'uploading'/'uploaded'/'terminated'/'failed'
    status: {
      type: String,
      defaultValue: 'in-progress'
    }
  }
]);
