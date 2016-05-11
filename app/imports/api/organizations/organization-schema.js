import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { OrgCurrencies,  UserMembership } from '/imports/api/constants.js';
import { TimePeriodSchema } from '../schemas.js';


const orgUserSchema = new SimpleSchema({
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  role: {
    type: String,
    allowedValues: _.values(UserMembership)
  },
  deletedBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  }
});

const ncStepTimesSchema = new SimpleSchema({
  minor: {
    type: TimePeriodSchema
  },
  major: {
    type: TimePeriodSchema
  },
  critical: {
    type: TimePeriodSchema
  }
});

const ncReminderSchema = new SimpleSchema({
  interval: {
    type: TimePeriodSchema
  },
  pastDue: {
    type: TimePeriodSchema
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

const OrganizationEditableFields = {
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
};

const OrganizationSchema = new SimpleSchema([OrganizationEditableFields, {
  serialNumber: {
    type: Number,
    min: 0
  },
  users: {
    type: [orgUserSchema],
    minCount: 1
  }
}]);

export { OrganizationEditableFields, OrganizationSchema };
