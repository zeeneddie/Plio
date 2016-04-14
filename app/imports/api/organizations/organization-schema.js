import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import {
  OrgCurrencies, TimeUnits, UserRoles
} from '/imports/api/constants.js';


const orgUserSchema = new SimpleSchema({
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  role: {
    type: String,
    allowedValues: _.values(UserRoles)
  }
});

const timePeriodSchema = new SimpleSchema({
  timeUnit: {
    type: String,
    allowedValues: _.values(TimeUnits)
  },
  timeValue: {
    type: Number,
    min: 0
  }
});

const ncStepTimesSchema = new SimpleSchema({
  minor: {
    type: timePeriodSchema
  },
  major: {
    type: timePeriodSchema
  },
  critical: {
    type: timePeriodSchema
  }
});

const ncReminderSchema = new SimpleSchema({
  interval: {
    type: timePeriodSchema
  },
  pastDue: {
    type: timePeriodSchema
  }
});

const ncRemindersSchema = new SimpleSchema({
  minor: {
    type: ncReminderSchema
  },
  major: {
    type: ncReminderSchema
  },
  critical: {
    type: ncReminderSchema
  }
});

const ncGuidelinesSchema = new SimpleSchema({
  minor: {
    type: String
  },
  major: {
    type: String
  },
  critical: {
    type: String
  }
});

export const OrganizationSchema = new SimpleSchema({
  name: {
    type: String,
    min: 1,
    max: 40
  },
  currency: {
    type: String,
    allowedValues: _.values(OrgCurrencies),
    optional: true
  },
  users: {
    type: [orgUserSchema],
    minCount: 1
  },
  ncStepTimes: {
    type: ncStepTimesSchema,
    optional: true
  },
  ncReminders: {
    type: ncRemindersSchema,
    optional: true
  },
  ncGuidelines: {
    type: ncGuidelinesSchema,
    optional: true
  }
});
