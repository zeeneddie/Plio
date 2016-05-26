import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema } from '../schemas.js';


export const DepartmentSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationIdSchema,
  {
    name: {
      type: String,
      min: 1
    }
  }
]);
