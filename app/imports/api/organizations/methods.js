import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Roles } from 'meteor/alanning:roles';

import OrganizationService from './organization-service';
import { Organizations } from './organizations';
import InvitationService from './invitation-service';

import { OrganizationEditableFields, OrganizationCurrencySchema } from './organization-schema';
import { OrgWorkflows, NCTypes, UserRoles, UserMembership } from '../constants';
import { canChangeOrgSettings, canInviteUsers, canDeleteUsers } from '../checkers.js';
import {
  IdSchema, TimePeriodSchema,
  OrganizationIdSchema, NewUserDataSchema,
  UserIdSchema, TimezoneSchema
} from '../schemas';


const nameSchema = new SimpleSchema({
  name: { type: String }
});

const ncTypeSchema = new SimpleSchema({
  ncType: {
    type: String,
    allowedValues: _.values(NCTypes)
  }
});

const unauthorizedErrorMessage = 'Unauthorized user cannot update an organization';
const changeOrgErrorMessage = 'User is not authorized for editing organization settings';

const checkUser = (userId, orgId) => {
  if (!userId) {
    throw new Meteor.Error(403, unauthorizedErrorMessage);
  }

  if (!canChangeOrgSettings(userId, orgId)) {
    throw new Meteor.Error(403, changeOrgErrorMessage);
  }
};

export const insert = new ValidatedMethod({
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

  run({ name, timezone, currency }) {
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create an organization'
      );
    }

    if (Meteor.isServer) {
      return OrganizationService.insert({
        name,
        timezone,
        currency,
        ownerId: userId
      });
    }
  }
});

export const update = new ValidatedMethod({
  name: 'Organizations.update',

  validate: new SimpleSchema([
    IdSchema,
    OrganizationEditableFields
  ]).validator(),

  run({ _id, ...args }) {
    checkUser(this.userId, _id);

    return OrganizationService.update({ _id, ...args });
  }
});

export const setName = new ValidatedMethod({
  name: 'Organizations.setName',

  validate: new SimpleSchema([
    IdSchema,
    nameSchema
  ]).validator(),

  run({ _id, ...args }) {
    checkUser(this.userId, _id);

    return OrganizationService.setName({ _id, ...args });
  }
});

export const setTimezone = new ValidatedMethod({
  name: 'Organizations.setTimezone',

  validate: new SimpleSchema([
    IdSchema,
    TimezoneSchema
  ]).validator(),

  run({ _id, ...args }) {
    checkUser(this.userId, _id);

    return OrganizationService.setTimezone({ _id, ...args });
  }
});

export const setDefaultCurrency = new ValidatedMethod({
  name: 'Organizations.setDefaultCurrency',

  validate: new SimpleSchema([IdSchema, {
    currency: { type: String }
  }]).validator(),

  run({ _id, ...args }) {
    checkUser(this.userId, _id);

    return OrganizationService.setDefaultCurrency({ _id, ...args });
  }
});

export const setWorkflowDefaults = new ValidatedMethod({
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
        allowedValues: _.values(OrgWorkflows),
        optional: true
      },
      stepTime: {
        type: TimePeriodSchema,
        optional: true
      }
    }
  ]).validator(),

  run({ _id, ...args }) {
    checkUser(this.userId, _id);

    return OrganizationService.setWorkflowDefaults({ _id, ...args });
  }
});

export const setReminder = new ValidatedMethod({
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

  run({ _id, ...args }) {
    checkUser(this.userId, _id);

    return OrganizationService.setReminder({ _id, ...args });
  }
});

export const setGuideline = new ValidatedMethod({
  name: 'Organizations.setGuideline',

  validate: new SimpleSchema([
    IdSchema,
    ncTypeSchema,
    {
      text: { type: String }
    }
  ]).validator(),

  run({ _id, ...args }) {
    checkUser(this.userId, _id);

    return OrganizationService.setGuideline({ _id, ...args });
  }
});

export const inviteUserByEmail = new ValidatedMethod({
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

  run({ organizationId, email, welcomeMessage }) {
    if (this.isSimulation) {
      return;
    }

    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot invite users'
      );
    }

    if (!canInviteUsers(userId, organizationId)) {
      throw new Meteor.Error(
        403,
        'User is not authorized for inviting user\'s from this organization'
      );
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

  run({invitationId, userData}) {
    if (this.isSimulation) {
      return;
    }

    //no permission checks are required
    InvitationService.acceptInvitation(invitationId, userData);
  }
});


export const inviteMultipleUsersByEmail = new ValidatedMethod({
  name: 'Organizations.inviteMultipleUsers',

  validate: new SimpleSchema([
    OrganizationIdSchema,
    {
      emails: {
        type: [String],
        regEx: SimpleSchema.RegEx.Email
      },
      welcomeMessage: {
        type: String
      }
    }
  ]).validator(),

  run({ organizationId, emails, welcomeMessage }) {
    if (this.isSimulation) {
      return;
    }

    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot invite users'
      );
    }

    if (!canInviteUsers(userId, organizationId)) {
      throw new Meteor.Error(
        403,
        'You don\'t have a superpower to invite other users in this organization'
      );
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
      error: generateErrorMessage(),
      invitedEmails,
      expirationTime: InvitationService.getInvitationExpirationTime()
    };
  }
});

export const removeUser = new ValidatedMethod({
  name: 'Organizations.removeUser',

  validate: new SimpleSchema([
    OrganizationIdSchema,
    UserIdSchema
  ]).validator(),

  run({ userId, organizationId }) {
    const currUserId = this.userId;
    if (!currUserId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot remove users'
      );
    }

    if (!((currUserId === userId) || canDeleteUsers(currUserId, organizationId))) {
      throw new Meteor.Error(
        403,
        'User is not authorized for removing user\'s from this organization'
      );
    }

    return OrganizationService.removeUser({
      removedBy: currUserId,
      organizationId,
      userId
    });
  }
});

export const createOrganizationTransfer = new ValidatedMethod({
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

  run({ organizationId, newOwnerId }) {
    if (this.isSimulation) {
      return;
    }

    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot transfer organizations'
      );
    }

    return OrganizationService.createTransfer({
      currOwnerId: userId,
      organizationId,
      newOwnerId
    });
  }
});

export const transferOrganization = new ValidatedMethod({
  name: 'Organizations.transfer',

  validate: new SimpleSchema({
    transferId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),

  run({ transferId }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot be an organization owner'
      );
    }

    return OrganizationService.transfer({
      newOwnerId: userId,
      transferId,
    });
  }
});

export const cancelOrganizationTransfer = new ValidatedMethod({
  name: 'Organizations.cancelTransfer',

  validate: OrganizationIdSchema.validator(),

  run({ organizationId }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot cancel transfers'
      );
    }

    return OrganizationService.cancelTransfer({ userId, organizationId });
  }
});
