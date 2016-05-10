import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const LessonsSchema = new SimpleSchema({
  standardId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  title: {
    type: String
  },
  date: {
    type: String
  },
  owner: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
});
