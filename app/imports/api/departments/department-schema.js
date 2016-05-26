import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { OrganizationIdSchema } from '../schemas.js';


export const DepartmentSchema = new SimpleSchema([OrganizationIdSchema, {
  name: {
    type: String,
    min: 1
  }
}]);
