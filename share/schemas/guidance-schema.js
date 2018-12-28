import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema } from './schemas';
import { CanvasTypes } from '../constants';

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
    },
    title: {
      type: String,
      min: 1,
      optional: true,
    },
  },
]);

export default GuidanceSchema;
