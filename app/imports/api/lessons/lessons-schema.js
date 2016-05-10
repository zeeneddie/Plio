import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const LessonsSchema = new SimpleSchema({
  _id: {
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

export LessonsSchema;
