import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema } from './schemas';
import { CanvasTypes, StringLimits } from '../constants';

const GuidanceSchema = new SimpleSchema([
  BaseEntitySchema,
  {
    documentType: {
      type: String,
      allowedValues: Object.values(CanvasTypes),
      index: 1,
    },
    html: {
      type: String,
      min: 1,
      max: StringLimits.markdown.max,
    },
    title: {
      type: String,
      min: 1,
      optional: true,
    },
  },
]);

export default GuidanceSchema;
