import { SimpleSchema } from 'meteor/aldeed:simple-schema';


export const DepartmentSchema = new SimpleSchema({
  name: {
    type: String
  },
  organizationId: {
    type: String
  }
});
