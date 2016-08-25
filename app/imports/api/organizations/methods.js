import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Roles } from 'meteor/alanning:roles';

import OrganizationService from './organization-service';
import { Organizations } from './organizations';
import InvitationService from './invitation-service';

import { OrganizationEditableFields, OrganizationCurrencySchema } from './organization-schema';
import {
  WorkflowTypes, NCTypes, UserRoles,
  UserMembership, ProblemGuidelineTypes, RKTypes
} from '../constants';
import {
  IdSchema, TimePeriodSchema,
  OrganizationIdSchema, NewUserDataSchema,
  UserIdSchema, TimezoneSchema
} from '../schemas';
import Method, { CheckedMethod } from '../method.js';
import { chain } from '../helpers.js';
import {
  checkOrgMembership,
  checkDocExistance,
  ORG_CheckExistance,
  ORG_EnsureCanChange,
  ORG_EnsureNameIsUnique,
  ORG_EnsureCanInvite,
  ORG_EnsureCanDeleteUsers,
  ORG_EnsureIsOwner,
  ORG_OnTransferCreateChecker,
  ORG_OnTransferChecker
} from '../checkers.js';

const nameSchema = new SimpleSchema({
  name: { type: String }
});

const problemGuidelineTypeSchema = new SimpleSchema({
  type: {
    type: String,
    allowedValues: _.values(ProblemGuidelineTypes)
  }
});

const ensureCanChange = function ensureCanChange({ _id }) {
  return ORG_EnsureCanChange(this.userId, _id);
};

const ensureCanInvite = function ensureCanInvite({ organizationId }) {
  return ORG_EnsureCanInvite(this.userId, organizationId);
};

const ensureCanDelete = function ensureCanDelete({ userId, organizationId }) {
  return ORG_EnsureCanDeleteUsers(userId, this.userId, organizationId);
};

export const insert = new Method({
  name: 'Organizations.insert',

  validate(doc) {
    const schema = new SimpleSchema([
      nameSchema,
      TimezoneSchema,
      OrganizationCurrencySchema
    ]);

    schema.clean(doc, {
      removeEmptyStrings: true
    });

    return schema.validator()(doc);
  },

  check(checker) {
    return checker(ORG_EnsureNameIsUnique);
  },

  run({ name, timezone, currency }) {
    if (Meteor.isServer) {
      return OrganizationService.insert({
        name,
        timezone,
        currency,
        ownerId: this.userId
      });
    }
  }
});

export const setName = new Method({
  name: 'Organizations.setName',

  validate: new SimpleSchema([
    IdSchema,
    nameSchema
  ]).validator(),

  check(checker) {
    return checker(chain(ensureCanChange.bind(this), ORG_EnsureNameIsUnique));
  },

  run({ _id, ...args }) {
    return OrganizationService.setName({ _id, ...args });
  }
});

export const setTimezone = new Method({
  name: 'Organizations.setTimezone',

  validate: new SimpleSchema([
    IdSchema,
    TimezoneSchema
  ]).validator(),

  check(checker) {
    return checker(ensureCanChange.bind(this));
  },

  run({ ...args }) {
    return OrganizationService.setTimezone({ ...args });
  }
});

export const setDefaultCurrency = new Method({
  name: 'Organizations.setDefaultCurrency',

  validate: new SimpleSchema([IdSchema, {
    currency: { type: String }
  }]).validator(),

  check(checker) {
    return checker(ensureCanChange.bind(this));
  },

  run({ ...args }) {
    return OrganizationService.setDefaultCurrency({ ...args });
  }
});

export const setWorkflowDefaults = new Method({
  name: 'Organizations.setWorkflowDefaults',

  validate: new SimpleSchema([
    IdSchema,
    {
      type: {
        type: String,
        allowedValues: ['minorProblem', 'majorProblem', 'criticalProblem']
      },
      workflowType: {
        type: String,
        allowedValues: _.values(WorkflowTypes),
        optional: true
      },
      stepTime: {
        type: TimePeriodSchema,
        optional: true
      }
    }
  ]).validator(),

  check(checker) {
    return checker(ensureCanChange.bind(this));
  },

  run({ ...args }) {
    return OrganizationService.setWorkflowDefaults({ ...args });
  }
});

export const setReminder = new Method({
  name: 'Organizations.setReminder',

  validate: new SimpleSchema([
    IdSchema,
    TimePeriodSchema,
    {
      type: {
        type: String,
        allowedValues: ['minorNc', 'majorNc', 'criticalNc', 'improvementPlan']
      },
      reminderType: {
        type: String,
        allowedValues: ['start', 'interval', 'until']
      }
    }
  ]).validator(),

  check(checker) {
    return checker(ensureCanChange.bind(this));
  },

  run({ ...args }) {
    return OrganizationService.setReminder({ ...args });
  }
});

export const setNCGuideline = new Method({
  name: 'Organizations.setNCGuideline',

  validate: new SimpleSchema([
    IdSchema,
    problemGuidelineTypeSchema,
    {
      text: { type: String }
    }
  ]).validator(),

  check(checker) {
    return checker(ensureCanChange.bind(this));
  },

  run({ ...args }) {
    return OrganizationService.setNCGuideline({ ...args });
  }
});

export const setRKGuideline = new Method({
  name: 'Organizations.setRKGuideline',

  validate: new SimpleSchema([
    IdSchema, problemGuidelineTypeSchema,
    {
      text: {type: String}
    }
  ]).validator(),

  check(checker) {
    return checker(ensureCanChange.bind(this));
  },

  run(doc) {
    return OrganizationService.setRKGuideline(doc);
  }
});

export const setRKScoringGuidelines = new Method({
  name: 'Organizations.setRKScoringGuidelines',

  validate: new SimpleSchema([
    IdSchema, {
      rkScoringGuidelines: { type: String }
    }
  ]).validator(),

  check(checker) {
    return checker(ensureCanChange.bind(this));
  },

  run({ _id, rkScoringGuidelines }) {
    return OrganizationService.setRKScoringGuidelines({ _id, rkScoringGuidelines });
  }
});

export const inviteUserByEmail = new Method({
  name: 'Organizations.inviteUserByEmail',

  validate: new SimpleSchema([
    OrganizationIdSchema,
    {
      email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
      },
      welcomeMessage: {
        type: String
      }
    }
  ]).validator(),

  check(checker) {
    checker(ensureCanInvite.bind(this));
  },

  run({ organizationId, email, welcomeMessage }) {
    if (this.isSimulation) {
      return;
    }

    InvitationService.inviteUserByEmail(organizationId, email, welcomeMessage);

    return InvitationService.getInvitationExpirationTime();
  }
});

export const acceptInvitation = new ValidatedMethod({
  name: 'Organizations.acceptInvitation',

  validate: new SimpleSchema({
    invitationId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    userData: {
      type: NewUserDataSchema
    }
  }).validator(),

  run({ invitationId, userData }) {
    if (this.isSimulation) {
      return;
    }

    //no permission checks are required
    InvitationService.acceptInvitation(invitationId, userData);
  }
});


export const inviteMultipleUsersByEmail = new Method({
  name: 'Organizations.inviteMultipleUsers',

  validate: new SimpleSchema([
    OrganizationIdSchema,
    {
      emails: {
        label: "Email address",
        type: [String],
        regEx: SimpleSchema.RegEx.Email
      },
      welcomeMessage: {
        type: String
      }
    }
  ]).validator(),

  check(checker) {
    return checker(ensureCanInvite.bind(this));
  },

  run({ organizationId, emails, welcomeMessage }) {
    if (this.isSimulation) {
      return;
    }

    let invitedEmails = [];
    let errors = [];
    emails.forEach(email => {
      //aggregate service errors for each email
      try {
        InvitationService.inviteUserByEmail(organizationId, email, welcomeMessage);
        invitedEmails.push(email);
      } catch (err) {
        console.error(err);
        errors.push(err.reason);
      }
    });

    const generateErrorMessage = () => {
      if (errors.length > 0) {
        return `Failed to invite ${errors.length} user(s):\n${errors.join('.\n')}`;
      } else {
        return null;
      }
    };

    return {
      invitedEmails,
      error: generateErrorMessage(),
      expirationTime: InvitationService.getInvitationExpirationTime()
    };
  }
});

export const removeUser = new Method({
  name: 'Organizations.removeUser',

  validate: new SimpleSchema([
    OrganizationIdSchema,
    UserIdSchema
  ]).validator(),

  check(checker) {
    return checker(ensureCanDelete.bind(this));
  },

  run({ userId, organizationId }) {
    return OrganizationService.removeUser({
      organizationId,
      userId,
      removedBy: this.userId
    });
  }
});

export const createOrganizationTransfer = new Method({
  name: 'Organizations.createTransfer',

  validate: new SimpleSchema([
    OrganizationIdSchema,
    {
      newOwnerId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
      }
    }
  ]).validator(),

  check(checker) {
    const mapArgs = fn => ({ organizationId, newOwnerId }) => fn(newOwnerId, this.userId, organizationId);

    return checker(mapArgs(ORG_OnTransferCreateChecker));
  },

  run({ organizationId, newOwnerId }) {
    if (this.isSimulation) {
      return;
    }

    return OrganizationService.createTransfer({
      organizationId,
      newOwnerId,
      currOwnerId: this.userId
    });
  }
});

export const transferOrganization = new Method({
  name: 'Organizations.transfer',

  validate: new SimpleSchema({
    transferId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),

  check(checker) {
    const mapArgs = fn => ({ transferId }) => fn(this.userId, transferId);

    return checker(mapArgs(ORG_OnTransferChecker));
  },

  run({ transferId }, organization) {
    return OrganizationService.transfer({
      transferId,
      newOwnerId: this.userId
    }, organization);
  }
});

export const cancelOrganizationTransfer = new Method({
  name: 'Organizations.cancelTransfer',

  validate: OrganizationIdSchema.validator(),

  check(checker) {
    const mapArgs = fn => ({ organizationId }) => fn(this.userId, organizationId);

    return checker(mapArgs(ORG_EnsureIsOwner));
  },

  run({ organizationId }) {
    return OrganizationService.cancelTransfer({ organizationId });
  }
});
