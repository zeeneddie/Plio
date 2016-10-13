import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema } from '../schemas.js';
import { StringLimits } from '/imports/api/constants.js';


export const StandardsTypeSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationIdSchema,
  {
    title: {
      type: String,
      label: 'Standard type title',
      min: StringLimits.title.min,
      max: StringLimits.title.max
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
