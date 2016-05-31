import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Roles } from 'meteor/alanning:roles';

import OrganizationService from './organization-service';
import { Organizations } from './organizations';
import InvitationService from './invitation-service';

import { OrganizationEditableFields, OrganizationCurrencySchema } from './organization-schema';
import { NCTypes, UserRoles, UserMembership } from '../constants';
import {
  IdSchema, TimePeriodSchema,
  OrganizationIdSchema, NewUserDataSchema,
  UserIdSchema
} from '../schemas';


const nameSchema = new SimpleSchema({
  name: {type: String}
});

const ncTypeSchema = new SimpleSchema({
  ncType: {
    type: String,
    allowedValues: _.values(NCTypes)
  }
});

const updateErrorMessage = 'Unauthorized user cannot update an organization';

const isOrgOwner = (orgId, userId) => {
  return !!Organizations.findOne({
    _id: orgId,
    users: {
      $elemMatch: {
        userId: userId,
        role: UserMembership.ORG_OWNER
      }
    }
  });
};

export const insert = new ValidatedMethod({
  name: 'Organizations.insert',
  validate: new SimpleSchema([nameSchema, OrganizationCurrencySchema]).validator(),

  run({name, currency}) {
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create an organization'
      );
    }

    return OrganizationService.insert({
      name,
      currency,
      ownerId: userId
    });
  }
});

export const update = new ValidatedMethod({
  name: 'Organizations.update',

  validate: new SimpleSchema([
    OrganizationEditableFields, IdSchema
  ]).validator(),

  run(doc) {
    if (!this.userId) {
      throw new Meteor.Error(403, updateErrorMessage);
    }

    const canEditOrgSettings = Roles.userIsInRole(this.userId, UserRoles.CHANGE_ORG_SETTINGS, doc._id);

    if (!canEditOrgSettings) {
      throw new Meteor.Error(
        403,
        'User is not authorized for editing organization settings'
      );
    }

    return OrganizationService.update(doc);
  }
});

export const setName = new ValidatedMethod({
  name: 'Organizations.setName',

  validate: new SimpleSchema([
    IdSchema, nameSchema
  ]).validator(),

  run(doc) {
    if (!this.userId) {
      throw new Meteor.Error(403, updateErrorMessage);
    }

    const canEditOrgSettings = Roles.userIsInRole(this.userId, UserRoles.CHANGE_ORG_SETTINGS, doc._id);

    if (!canEditOrgSettings) {
      throw new Meteor.Error(
        403,
        'User is not authorized for editing organization settings'
      );
    }

    return OrganizationService.setName(doc);
  }
});

export const setDefaultCurrency = new ValidatedMethod({
  name: 'Organizations.setDefaultCurrency',

  validate: new SimpleSchema([IdSchema, {
    currency: {type: String}
  }]).validator(),

  run(doc) {
    if (!this.userId) {
      throw new Meteor.Error(403, updateErrorMessage);
    }

    const canEditOrgSettings = Roles.userIsInRole(this.userId, UserRoles.CHANGE_ORG_SETTINGS, doc._id);

    if (!canEditOrgSettings) {
      throw new Meteor.Error(
        403,
        'User is not authorized for editing organization settings'
      );
    }

    return OrganizationService.setDefaultCurrency(doc);
  }
});

export const setStepTime = new ValidatedMethod({
  name: 'Organizations.setStepTime',

  validate: new SimpleSchema([
    IdSchema, ncTypeSchema, TimePeriodSchema
  ]).validator(),

  run(doc) {
    if (!this.userId) {
      throw new Meteor.Error(403, updateErrorMessage);
    }

    const canEditOrgSettings = Roles.userIsInRole(this.userId, UserRoles.CHANGE_ORG_SETTINGS, doc._id);

    if (!canEditOrgSettings) {
      throw new Meteor.Error(
        403,
        'User is not authorized for editing organization settings'
      );
    }

    return OrganizationService.setStepTime(doc);
  }
});

export const setReminder = new ValidatedMethod({
  name: 'Organizations.setReminder',

  validate: new SimpleSchema([
    IdSchema, ncTypeSchema, TimePeriodSchema,
    {
      reminderType: {
        type: String,
        allowedValues: ['interval', 'pastDue']
      }
    }
  ]).validator(),

  run(doc) {
    if (!this.userId) {
      throw new Meteor.Error(403, updateErrorMessage);
    }

    const canEditOrgSettings = Roles.userIsInRole(this.userId, UserRoles.CHANGE_ORG_SETTINGS, doc._id);

    if (!canEditOrgSettings) {
      throw new Meteor.Error(
        403,
        'User is not authorized for editing organization settings'
      );
    }

    return OrganizationService.setReminder(doc);
  }
});

export const setGuideline = new ValidatedMethod({
  name: 'Organizations.setGuideline',

  validate: new SimpleSchema([
    IdSchema, ncTypeSchema,
    {
      text: {type: String}
    }
  ]).validator(),

  run(doc) {
    if (!this.userId) {
      throw new Meteor.Error(403, updateErrorMessage);
    }

    const canEditOrgSettings = Roles.userIsInRole(this.userId, UserRoles.CHANGE_ORG_SETTINGS, doc._id);

    if (!canEditOrgSettings) {
      throw new Meteor.Error(
        403,
        'User is not authorized for editing organization settings'
      );
    }

    return OrganizationService.setGuideline(doc);
  }
});

export const inviteUserByEmail = new ValidatedMethod({
  name: 'Organizations.inviteUserByEmail',

  validate: new SimpleSchema([OrganizationIdSchema, {
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    },
    welcomeMessage: {
      type: String
    }
  }]).validator(),

  run({organizationId, email, welcomeMessage}) {
    if (this.isSimulation) {
      return;
    }

    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot invite users'
      );
    }

    const canInviteUser = Roles.userIsInRole(userId, UserRoles.INVITE_USERS, organizationId);

    if (!canInviteUser) {
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

  validate: new SimpleSchema([OrganizationIdSchema, {
    emails: {
      type: [String],
      regEx: SimpleSchema.RegEx.Email
    },
    welcomeMessage: {
      type: String
    }
  }]).validator(),

  run({organizationId, emails, welcomeMessage}) {
    if (this.isSimulation) {
      return;
    }

    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot invite users'
      );
    }

    const canInviteUser = Roles.userIsInRole(userId, UserRoles.INVITE_USERS, organizationId);

    if (!canInviteUser) {
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

  run({userId, organizationId}) {
    const currUserId = this.userId;
    if (!currUserId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot remove users'
      );
    }

    if (isOrgOwner(organizationId, userId)) {
      throw new Meteor.Error(403, 'Organization owner can\'t be removed');
    }

    const canRemoveUser = (currUserId === userId) || Roles.userIsInRole(
        currUserId, UserRoles.DELETE_USERS, organizationId
      );
    if (!canRemoveUser) {
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

export const transferOrganization = new ValidatedMethod({
  name: 'Organizations.transfer',

  validate: new SimpleSchema([
    OrganizationIdSchema,
    {
      newOwmerId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
      }
    }
  ]).validator(),

  run({ organizationId, newOwmerId }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot transfer organizations'
      );
    }

    if (!isOrgOwner(organizationId, userId)) {
      throw new Meteor.Error(
        403, 'User is not authorized for transfering organizations'
      );
    }

    return OrganizationService.transfer({
      currOwnerId: userId,
      organizationId,
      newOwmerId
    });
  }
});
