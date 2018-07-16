import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
  BaseEntitySchema,
  OrganizationIdSchema,
  idSchemaDoc,
} from './schemas';
import { StringLimits, KeyPartnerColors, Criticality, LevelOfSpend } from '../constants';

const KeyPartnerSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationIdSchema,
  {
    title: {
      type: String,
      min: StringLimits.title.min,
      max: StringLimits.title.max,
    },
    createdBy: idSchemaDoc,
    notes: {
      type: String,
      optional: true,
      max: StringLimits.description.max,
    },
    color: {
      type: String,
      allowedValues: Object.values(KeyPartnerColors),
    },
    criticality: {
      type: Number,
      allowedValues: Object.values(Criticality),
    },
    levelOfSpend: {
      type: Number,
      allowedValues: Object.values(LevelOfSpend),
    },
  },
]);

export default KeyPartnerSchema;
