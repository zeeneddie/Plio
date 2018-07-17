import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
  BaseEntitySchema,
  OrganizationIdSchema,
  idSchemaDoc,
} from './schemas';
import { StringLimits, KeyResourceColors } from '../constants';

const KeyResourceSchema = new SimpleSchema([
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
      allowedValues: Object.values(KeyResourceColors),
    },
  },
]);

export default KeyResourceSchema;
