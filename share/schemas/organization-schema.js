import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { OrgCurrencies,  WorkflowTypes, UserMembership } from '/imports/api/constants.js';
import { BaseEntitySchema, TimePeriodSchema, TimezoneSchema } from '../schemas.js';


const orgUserSchema = new SimpleSchema({
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  role: {
    type: String,
    allowedValues: _.values(UserMembership)
  },
  isRemoved: {
    type: Boolean,
    defaultValue: false,
    optional: true
  },
  joinedAt: {
    autoValue(){
      if(!this.isSet){
        return new Date();
      }
    },
    type: Date,
  },
  removedBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  removedAt: {
    type: Date,
    optional: true
  }
});

const problemWorkflowSchema = new SimpleSchema({
  workflowType: {
    type: String,
    allowedValues: _.values(WorkflowTypes)
  },
  stepTime: {
    type: TimePeriodSchema
  }
});

const workflowDefaultsSchema = new SimpleSchema({
  minorProblem: {
    type: problemWorkflowSchema
  },
  majorProblem: {
    type: problemWorkflowSchema
  },
  criticalProblem: {
    type: problemWorkflowSchema
  }
});

const reminderSchema = new SimpleSchema({
  start: {
    type: TimePeriodSchema
  },
  interval: {
    type: TimePeriodSchema
  },
  until: {
    type: TimePeriodSchema
  }
});

const remindersSchema = new SimpleSchema({
  minorNc: {
    type: reminderSchema
  },
  majorNc: {
    type: reminderSchema
  },
  criticalNc: {
    type: reminderSchema
  },
  improvementPlan: {
    type: reminderSchema
  }
});

const guidelinesSchema = new SimpleSchema({
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

const OrganizationCurrencySchema = {
  currency: {
    type: String,
    allowedValues: _.values(OrgCurrencies),
    optional: true
  }
};

const OrganizationEditableFields = {
  name: {
    type: String,
    min: 1,
    max: 40
  },
  workflowDefaults: {
    type: workflowDefaultsSchema,
    optional: true
  },
  reminders: {
    type: remindersSchema,
    optional: true
  },
  ncGuidelines: {
    type: guidelinesSchema,
    optional: true
  },
  rkGuidelines: {
    type: guidelinesSchema,
    optional: true
  },
  rkScoringGuidelines: {
    type: String,
    optional: true
  },
  ...OrganizationCurrencySchema,
  ...TimezoneSchema.schema()
};

const transferSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  newOwnerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  createdAt: {
    type: Date
  }
});

const OrganizationSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationEditableFields,
  {
    serialNumber: {
      type: Number,
      min: 0
    },
    users: {
      type: [orgUserSchema],
      minCount: 1
    },
    transfer: {
      type: transferSchema,
      optional: true
    }
  }
]);

export { OrganizationEditableFields, OrganizationSchema, OrganizationCurrencySchema };
