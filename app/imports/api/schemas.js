import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TimeUnits } from './constants.js';


export const IdSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
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

export const NewUserDataSchema = new SimpleSchema({
  firstName: {
    type: String,
    min: 1,
    max: 20
  },
  lastName: {
    type: String,
    min: 1,
    max: 20
  },
  password: {
    type: String,
    min: 6,
    max: 20
  }
});

const idSchemaDoc = {
  type: String,
  regEx: SimpleSchema.RegEx.Id
};

export const OrganizationIdSchema = new SimpleSchema({
  organizationId: idSchemaDoc
});

export const UserIdSchema = new SimpleSchema({
  userId: idSchemaDoc
});
