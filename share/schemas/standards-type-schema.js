import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema } from './schemas.js';


export const StandardsTypeSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationIdSchema,
  {
    name: {
      type: String,
      min: 1,
      max: 40
    },
    abbreviation: {
      type: String,
      min: 1,
      max: 10
    }
  }
]);
