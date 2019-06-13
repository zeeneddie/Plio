import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import CanvasSchema from './canvas-schema';

const CostLineSchema = new SimpleSchema([
  CanvasSchema,
  {
    percentOfTotalCost: {
      type: Number,
      min: 0,
      max: 100,
      optional: true,
    },
  },
]);

export default CostLineSchema;
