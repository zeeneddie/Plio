import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema } from '../schemas.js';


const StandardsBookSectionEditableFields = new SimpleSchema({
  title: {
    type: String,
    min: 1
  }
});

const StandardsBookSectionSchema = new SimpleSchema([
  BaseEntitySchema,
  StandardsBookSectionEditableFields,
  OrganizationIdSchema
]);

export {
  StandardsBookSectionEditableFields,
  StandardsBookSectionSchema
};
