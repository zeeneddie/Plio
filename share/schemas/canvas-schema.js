import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
  BaseEntitySchema,
  OrganizationIdSchema,
  idSchemaDoc,
  FileIdsSchema,
  getNotifySchema,
} from './schemas';
import { StringLimits, CanvasColors } from '../constants';

const CanvasSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationIdSchema,
  FileIdsSchema,
  getNotifySchema('originatorId'),
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
      allowedValues: Object.values(CanvasColors),
    },
    goalIds: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
      defaultValue: [],
    },
    standardsIds: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
      defaultValue: [],
    },
    riskIds: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
      defaultValue: [],
    },
    nonconformityIds: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
      defaultValue: [],
    },
    potentialGainIds: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
      defaultValue: [],
    },
  },
]);

export default CanvasSchema;
