import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const StandardsSchema = new SimpleSchema({
  title: {
    type: String
  },
  typeId: {
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

const StandardsUpdateSchema = new SimpleSchema({
  title: {
    type: String,
    optional: true
  },
  typeId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  sectionId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  nestingLevel: {
    type: Number,
    optional: true
  },
  number: {
    type: [Number],
    optional: true
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
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  issueNumber: {
    type: Number,
    optional: true
  },
  status: {
    type: String,
    optional: true
  },
  departments: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  }
});

export { StandardsSchema, StandardsUpdateSchema };
