import { SimpleSchema } from 'meteor/aldeed:simple-schema';


export const StandardsTypeSchema = new SimpleSchema({
  name: {
    type: String
  },
  abbreviation: {
    type: String
  },
  organizationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
});
