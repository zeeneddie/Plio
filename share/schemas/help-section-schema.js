import { SimpleSchema } from 'meteor/aldeed:simple-schema';


export const HelpSectionSchema = new SimpleSchema({
  index: {
    type: Number,
    min: 1,
  },
  title: {
    type: String,
  },
});
