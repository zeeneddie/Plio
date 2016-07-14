import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema } from '../schemas.js';


const EditableFields = new SimpleSchema({
  title: {
    type: String,
    min: 1
  }
});

const RiskTypesSchema = new SimpleSchema([
  BaseEntitySchema,
  EditableFields,
  OrganizationIdSchema
]);

export {
  EditableFields,
  RiskTypesSchema
};
