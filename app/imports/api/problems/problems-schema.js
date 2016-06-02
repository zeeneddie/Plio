import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema } from '../schemas.js';

const optionalFields = new SimpleSchema({

});

const ProblemsSchema = new SimpleSchema([
  OrganizationIdSchema,
  BaseEntitySchema,
  {
    title: {
      type: String,
      min: 1,
      max: 40
    },
    serialNumber: {
      type: String,
      min: 3
    },
    standards: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id
    },
    identifiedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    identifiedAt: {
      type: Date
    },
    magnitude: {
      type: String
    }
  }
]);

export { ProblemsSchema };
