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
  createdBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  notes: {
    type: String
  }
});
