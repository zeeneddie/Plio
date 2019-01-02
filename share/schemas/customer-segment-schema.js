import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import CanvasSchema from './canvas-schema';
import { CanvasTypes } from '../constants';

const CustomerSegmentSchema = new SimpleSchema([
  CanvasSchema,
  {
    matchedTo: {
      type: new SimpleSchema({
        documentId: {
          type: String,
          regEx: SimpleSchema.RegEx.Id,
        },
        documentType: {
          type: String,
          allowedValues: [CanvasTypes.VALUE_PROPOSITION],
        },
      }),
      optional: true,
    },
    percentOfMarketSize: {
      type: Number,
      min: 0,
      max: 100,
      optional: true,
    },
  },
]);

export default CustomerSegmentSchema;
