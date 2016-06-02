import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema } from '../schemas.js';

const RisksSchema = new SimpleSchema([
  OrganizationIdSchema,
  BaseEntitySchema,
  {
    title: {
      type: String,
      min: 1
    },
    typeId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    owners: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id
    }
  }
]);

export { RisksSchema };
