import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema } from './schemas';
import { StringLimits } from '../constants';


const EditableFields = new SimpleSchema({
  title: {
    type: String,
    label: 'Risk type label',
    min: StringLimits.title.min,
    max: StringLimits.title.max,
  },
  abbreviation: {
    type: String,
    label: 'Risk type abbreviation',
    min: StringLimits.abbreviation.min,
    max: StringLimits.abbreviation.max,
    optional: true,
  }
});

const RiskTypesSchema = new SimpleSchema([
  BaseEntitySchema,
  EditableFields,
  OrganizationIdSchema,
]);

export {
  EditableFields,
  RiskTypesSchema,
};
