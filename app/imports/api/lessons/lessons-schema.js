import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, StandardIdSchema, OrganizationIdSchema } from '../schemas.js';


export const requiredSchema = new SimpleSchema([StandardIdSchema, {
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
