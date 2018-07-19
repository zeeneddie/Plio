import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Criticality, LevelOfSpend } from '../constants';
import CanvasSchema from './canvas-schema';

const KeyPartnerSchema = new SimpleSchema([
  CanvasSchema,
  {
    criticality: {
      type: Number,
      allowedValues: Object.values(Criticality),
    },
    levelOfSpend: {
      type: Number,
      allowedValues: Object.values(LevelOfSpend),
    },
  },
]);

export default KeyPartnerSchema;
