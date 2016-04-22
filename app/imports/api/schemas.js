import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TimeUnits } from './constants.js';


export const IdSchema = new SimpleSchema({
  _id: {
    type: String
  }
});

export const TimePeriodSchema = new SimpleSchema({
  timeUnit: {
    type: String,
    allowedValues: _.values(TimeUnits)
  },
  timeValue: {
    type: Number,
    min: 0
  }
});
