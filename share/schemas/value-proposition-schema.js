import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import CanvasSchema from './canvas-schema';
import { CanvasTypes } from '../constants';

const ValuePropositionSchema = new SimpleSchema([
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
          allowedValues: [CanvasTypes.CUSTOMER_SEGMENT],
        },
      }),
      optional: true,
    },
  },
]);

export default ValuePropositionSchema;
