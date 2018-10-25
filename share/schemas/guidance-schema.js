import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema } from './schemas';
import { CanvasTypes } from '../constants';

const GuidanceSchema = new SimpleSchema([
  BaseEntitySchema,
  {
    documentType: {
      type: String,
      allowedValues: Object.values(CanvasTypes),
    },
    html: {
      type: String,
      min: 1,
    },
  },
]);

export default GuidanceSchema;
