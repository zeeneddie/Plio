import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import CanvasSchema from './canvas-schema';

const RevenueStreamSchema = new SimpleSchema([
  CanvasSchema,
  {
    percentOfRevenue: {
      type: Number,
      min: 0,
      max: 100,
      optional: true,
    },
    percentOfProfit: {
      type: Number,
      min: 0,
      max: 100,
      optional: true,
    },
  },
]);

export default RevenueStreamSchema;
