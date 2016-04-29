import { SimpleSchema } from 'meteor/aldeed:simple-schema';


export const StandardsBookSectionSchema = new SimpleSchema({
  title: {
    type: String
  },
  organizationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
});
