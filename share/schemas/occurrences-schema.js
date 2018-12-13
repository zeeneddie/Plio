import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, ViewedBySchema, OrganizationIdSchema } from './schemas';

const RequiredSchema = new SimpleSchema({
  nonConformityId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    index: 1,
  },
  description: {
    type: String,
    min: 1,
  },
  date: {
    type: Date,
  },
});

const OccurrencesSchema = new SimpleSchema([
  OrganizationIdSchema,
  BaseEntitySchema,
  RequiredSchema,
  ViewedBySchema,
  {
    serialNumber: {
      type: Number,
      min: 0,
    },
    sequentialId: {
      type: String,
      min: 5,
    },
  },
]);

export { OccurrencesSchema, RequiredSchema };
