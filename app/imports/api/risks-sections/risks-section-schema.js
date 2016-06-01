import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema } from '../schemas.js';


const RisksSectionEditableFields = new SimpleSchema({
  title: {
    type: String,
    min: 1
  }
});

const RisksSectionSchema = new SimpleSchema([
  BaseEntitySchema,
  RisksSectionEditableFields,
  OrganizationIdSchema
]);

export {
  RisksSectionEditableFields,
  RisksSectionSchema
};
