import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const StandardsSchema = new SimpleSchema({
  title: {
    type: String
  },
  type: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  sectionId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  nestingLevel: {
    type: Number
  },
  number: {
    type: [Number]
  },
  description: {
    type: String,
    optional: true
  },
  approved: {
    type: Boolean,
    optional: true
  },
  approvedAt: {
    type: Date,
    optional: true
  },
  notes: {
    type: String,
    optional: true
  },
  owner: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  issueNumber: {
    type: Number
  },
  status: {
    type: String
  },
  departments: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  }
});
