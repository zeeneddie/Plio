import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema } from '../schemas.js';

const RequiredSchema = new SimpleSchema({
  nonConformityId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  description: {
    type: String
  },
  date: {
    type: Date
  }
});

const OccurencesSchema = new SimpleSchema([BaseEntitySchema, RequiredSchema]);

export { OccurencesSchema, RequiredSchema };
