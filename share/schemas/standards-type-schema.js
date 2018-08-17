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
    isDefault: {
      type: Boolean,
      optional: true,
    },
    reservedTitle: {
      type: String,
      min: StringLimits.title.min,
      max: StringLimits.title.max,
      optional: true,
      autoValue() {
        if (this.isInsert && this.field('isDefault').value === true) {
          return this.field('title').value;
        }

        return this.unset();
      },
    },
  },
]);
