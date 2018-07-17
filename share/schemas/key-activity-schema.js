import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
  BaseEntitySchema,
  OrganizationIdSchema,
  idSchemaDoc,
} from './schemas';
import { StringLimits, KeyActivityColors } from '../constants';

const KeyActivitySchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationIdSchema,
  {
    title: {
      type: String,
      min: StringLimits.title.min,
      max: StringLimits.title.max,
    },
    originatorId: idSchemaDoc,
    notes: {
      type: String,
      optional: true,
      max: StringLimits.description.max,
    },
    color: {
      type: String,
      allowedValues: Object.values(KeyActivityColors),
    },
  },
]);

export default KeyActivitySchema;
