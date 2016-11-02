import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { OrgCurrencies,  WorkflowTypes, UserMembership } from '../constants.js';
import { BaseEntitySchema, TimePeriodSchema, TimezoneSchema } from './schemas.js';


const UserSettingsSchema = new SimpleSchema({
  sendDailyRecap: {
    type: Boolean,
    autoValue() {
      if (!this.isSet) {
        return true;
      }
    }
  }
});

const OrgUserSchema = new SimpleSchema([
  {
    userId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    role: {
      type: String,
      allowedValues: _.values(UserMembership)
    },
    joinedAt: {
      autoValue() {
        if (!this.isSet) {
          return new Date();
        }
      },
      type: Date
    },
    isRemoved: {
      type: Boolean,
      autoValue() {
        if (!this.isSet) {
          return false;
        }
      }
    },
    removedAt: {
      type: Date,
      optional: true
    },
    removedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    }
  },
  UserSettingsSchema
]);

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

const OrganizationCurrencySchema = {
  currency: {
    type: String,
    allowedValues: _.values(OrgCurrencies),
    optional: true
  }
};

const ncGuidelinesSchema = new SimpleSchema({
  minor: {
    type: String,
    label: 'Guideline for classifying a minor non-conformity'
  },
  major: {
    type: String,
    label: 'Guideline for classifying a major non-conformity'
  },
  critical: {
    type: String,
    label: 'Guideline for classifying a critical non-conformity'
  }
});

const rkGuidelinesSchema = new SimpleSchema({
  minor: {
    type: String,
    label: 'Guideline for initial categorization of a minor risk'
  },
  major: {
    type: String,
    label: 'Guideline for initial categorization of a major risk'
  },
  critical: {
    type: String,
    label: 'Guideline for initial categorization of a critical risk'
  }
});

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
    type: ncGuidelinesSchema,
    optional: true
  },
  rkGuidelines: {
    type: rkGuidelinesSchema,
    optional: true
  },
  rkScoringGuidelines: {
    type: String,
    label: 'Risk scoring guidelines text',
    optional: true
  },
  isAdminOrg: {
    type: Boolean,
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
      type: [OrgUserSchema],
      minCount: 1,
      defaultValue: []
    },
    transfer: {
      type: transferSchema,
      optional: true
    }
  }
]);

export {
  OrganizationEditableFields,
  OrganizationSchema,
  OrganizationCurrencySchema,
  UserSettingsSchema
};
