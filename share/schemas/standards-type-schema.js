import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema } from './schemas';
import { StringLimits } from '../constants';


export const StandardsTypeSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationIdSchema,
  {
    title: {
      type: String,
      label: 'Standard type title',
      min: StringLimits.title.min,
      max: StringLimits.title.max,
    },
    abbreviation: {
      type: String,
      label: 'Standard type abbreviation',
      min: 0,
      max: 4,
      optional: true,
    },
  },
]);
