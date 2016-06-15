import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, DocumentIdSchema } from '../schemas.js';
import { documentTypes } from '../constants.js';


const requiredSchema = new SimpleSchema([DocumentIdSchema, {
  documentType: {
    type: String,
    allowedValues: documentTypes
  }
}]);

const optionalSchema = new SimpleSchema({
  'desiredOutcome': {
    type: String,
    optional: true
  },
  'targetDate': {
    type: Date,
    optional: true
  },
  'reviewDates': {
    type: [Object],
    optional: true
  },
  'reviewDates.$.date': {
    type: Date
  },
  'reviewDates.$._id': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'owner': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  'files': {
    type: [Object],
    optional: true
  },
  'files.$._id': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'files.$.extension': {
    type: String,
    autoValue() {
      if (this.isSet) {
        return this.value.toLowerCase();
      }
    },
  },
  'files.$.url': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  'files.$.name': {
    type: String
  }
});

const ImprovementPlansSchema = new SimpleSchema([
  BaseEntitySchema,
  requiredSchema,
  optionalSchema
]);

export { requiredSchema, optionalSchema, ImprovementPlansSchema };
