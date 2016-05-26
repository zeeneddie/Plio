import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { OrganizationIdSchema } from '../schemas.js';


export const StandardsTypeSchema = new SimpleSchema([OrganizationIdSchema, {
  name: {
    type: String,
    min: 1
  },
  abbreviation: {
    type: String,
    min: 1
  }
}]);
