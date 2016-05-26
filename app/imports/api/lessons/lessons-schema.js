import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { StandardIdSchema, OrganizationIdSchema } from '../schemas.js';


export const requiredSchema = new SimpleSchema([StandardIdSchema, {
  title: {
    type: String
  },
  date: {
    type: Date
  },
  createdBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  notes: {
    type: String
  }
}]);

export const LessonsSchema = new SimpleSchema([
  requiredSchema,
  OrganizationIdSchema,
  {
    serialNumber: {
      type: Number
    }
  }
]);
