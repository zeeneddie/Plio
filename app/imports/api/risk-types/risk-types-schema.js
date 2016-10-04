import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema } from '../schemas.js';


const EditableFields = new SimpleSchema({
  title: {
    type: String,
    label: 'Risk type label',
    min: 1,
    max: 40
  },
  abbreviation: {
    type: String,
    label: 'Risk type abbreviation',
    min: 1,
    max: 4,
    optional: true
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
