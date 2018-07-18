import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
  BaseEntitySchema,
  OrganizationIdSchema,
  idSchemaDoc,
} from './schemas';
import { StringLimits, CostLineColors } from '../constants';

const CostLineSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationIdSchema,
  {
    title: {
      type: String,
      min: StringLimits.title.min,
      max: StringLimits.title.max,
    },
    originatorId: idSchemaDoc,
    percentOfTotalCost: {
      type: Number,
      min: 0,
      max: 100,
    },
    notes: {
      type: String,
      optional: true,
      max: StringLimits.description.max,
    },
    color: {
      type: String,
      allowedValues: Object.values(CostLineColors),
    },
  },
]);

export default CostLineSchema;
