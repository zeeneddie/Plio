import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema } from './schemas.js';


export const StandardsTypeSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationIdSchema,
  {
    title: {
      type: String,
      label: 'Standard type title',
      min: 1,
      max: 80
    },
    abbreviation: {
      type: String,
      label: 'Standard type abbreviation',
      min: 1,
      max: 4,
      optional: true
    }
  }
]);
