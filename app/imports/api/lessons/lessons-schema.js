import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const requiredSchema = new SimpleSchema({
  standardId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  title: {
    type: String
  },
  date: {
    type: Date
  },
  createdBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  notes: {
    type: String
  }
});

export const LessonsSchema = new SimpleSchema([requiredSchema, {
  organizationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  serialNumber: {
    type: Number
  }
}]);
