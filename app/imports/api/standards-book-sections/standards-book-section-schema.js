import { SimpleSchema } from 'meteor/aldeed:simple-schema';


export const StandardsBookSectionSchema = new SimpleSchema({
  name: {
    type: String
  },
  number: {
    type: Number
  },
  organizationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
});
