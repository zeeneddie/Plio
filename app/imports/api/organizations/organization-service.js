import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Random } from 'meteor/random';

import { Organizations } from './organizations.js';
import StandardsTypeService from '../standards-types/standards-type-service.js';
import {
  DefaultStandardTypes,
  OrganizationDefaults,
  OrgOwnerRoles,
  OrgMemberRoles,
  UserMembership,
  UserRoles
} from '../constants.js';

import OrgNotificationsSender from './org-notifications-sender.js';


export default OrganizationService = {
  collection: Organizations,

  _ensureNameIsUnique(name) {
    const nameIsUnique = !this.collection.findOne({
      name: new RegExp(`^${name}$`, 'i')
    });
    if (!nameIsUnique) {
      throw new Meteor.Error(400, `Organization ${name} already exists`);
    }
  },

  insert({name, ownerId, currency}) {
    this._ensureNameIsUnique(name);

    const lastOrg = this.collection.findOne({
      serialNumber: {
        $type: 16 // 32-bit integer
      }
    }, {
      sort: {
        serialNumber: -1
      }
    });

    const serialNumber = lastOrg ? lastOrg.serialNumber + 1 : 100;

    const { workflowDefaults, reminders, ncGuidelines, rkScoringGuidelines } = OrganizationDefaults;

    const organizationId = this.collection.insert({
      name,
      currency,
      serialNumber,
      users: [{
        userId: ownerId,
        role: UserMembership.ORG_OWNER
      }],
      workflowDefaults,
      reminders,
      ncGuidelines,
      rkScoringGuidelines,
      createdBy: ownerId
    });

    _.each(DefaultStandardTypes, ({ name, abbreviation }) => {
      StandardsTypeService.insert({
        name,
        abbreviation,
        organizationId,
        createdBy: ownerId
      });
    });

    Roles.addUsersToRoles(ownerId, OrgOwnerRoles, organizationId);

    return organizationId;
  },

  update({_id, name, currency, workflowDefaults, reminders, ncGuidelines}) {
    return this.collection.update({_id}, {
      $set: {
        name, currency,
        workflowDefaults, reminders,
        ncGuidelines
      }
    });
  },

  remove() {

  },

  setName({_id, name}) {
    this._ensureNameIsUnique(name);

    return this.collection.update({ _id }, {
      $set: { name }
    });
  },

  setDefaultCurrency({_id, currency}) {
    return this.collection.update({ _id }, {
      $set: { currency }
    });
  },

  setWorkflowDefaults({_id, type, timeValue, timeUnit}) {
    return this.collection.update({ _id }, {
      $set: {
        [`workflowDefaults.${type}`]: {timeValue, timeUnit}
      }
    });
  },

  setReminder({_id, type, reminderType, timeValue, timeUnit}) {
    return this.collection.update({ _id }, {
      $set: {
        [`reminders.${type}.${reminderType}`]: {timeValue, timeUnit}
      }
    });
  },

  setGuideline({_id, ncType, text}) {
    return this.collection.update({ _id }, {
      $set: {
        [`ncGuidelines.${ncType}`]: text
      }
    });
  },

  setRKScoringGuidelines({ _id, rkScoringGuidelines }) {
    const query = { _id };
    const options = { $set: { rkScoringGuidelines } };
    return this.collection.update(query, options);
  },

  removeUser({ userId, organizationId, removedBy }) {
    const isAlreadyRemoved = !!this.collection.findOne({
      _id: organizationId,
      users: {
        $elemMatch: {
          userId,
          isRemoved: true,
          removedBy: {$exists: true},
          removedAt: {$exists: true}
        }
      }
    });

    if (isAlreadyRemoved) {
      throw new Meteor.Error(400, 'User is already removed');
    }

    Roles.removeUsersFromRoles(
      userId, _.values(UserRoles), organizationId
    );

    this.collection.update({
      _id: organizationId,
      'users.userId': userId
    }, {
      $set: {
        'users.$.isRemoved': true,
        'users.$.removedBy': removedBy,
        'users.$.removedAt': new Date()
      }
    });
  },

  _transferCheck(organizationId, newOwnerId, currOwnerId) {
    if (currOwnerId === newOwnerId) {
      throw new Meteor.Error(
        400, 'The target user already owns the transferred organization'
      );
    }

    const isOrgMember = !!this.collection.findOne({
      _id: organizationId,
      users: {
        $elemMatch: {
          userId: newOwnerId,
          role: UserMembership.ORG_MEMBER,
          isRemoved: false,
          removedBy: { $exists: false },
          removedAt: { $exists: false }
        }
      }
    });

    if (!isOrgMember) {
      throw new Meteor.Error(
        400, 'The target user must be a member of transferred organization'
      );
    }

    const newOwner = Meteor.users.findOne({
      _id: newOwnerId
    });

    if (!newOwner.hasVerifiedEmail()) {
      throw new Meteor.Error(
        400, 'The target user should have a verified email address'
      );
    }

    if (!newOwner.hasAcceptedInvite()) {
      throw new Meteor.Error(
        400,
        'The target user hasn\'t accepted the invitation to the transferred organization yet'
      );
    }
  },

  createTransfer({ organizationId, newOwnerId, currOwnerId }) {
    const isOnTransfer = !!this.collection.findOne({
      _id: organizationId,
      transfer: { $exists: true }
    });

    if (isOnTransfer) {
      throw new Meteor.Error(400, 'Organization is already on transfer');
    }

    this._transferCheck(organizationId, newOwnerId, currOwnerId);

    const transferId = Random.id();

    new OrgNotificationsSender(organizationId).sendOwnershipInvite(newOwnerId, transferId);

    return this.collection.update({
      _id: organizationId,
    }, {
      $set: {
        transfer: {
          _id: transferId,
          newOwnerId,
          createdAt: new Date()
        }
      }
    });
  },

  transfer({ newOwnerId, transferId }) {
    const organization = this.collection.findOne({
      'transfer._id': transferId,
      'transfer.newOwnerId': newOwnerId,
    });

    if (!organization) {
      throw new Meteor.Error(
        400,
        'Current organization owner canceled transfer or it is already completed'
      );
    }

    const organizationId = organization._id;
    const currOwnerId = organization.ownerId();

    this._transferCheck(organizationId, newOwnerId, currOwnerId);

    this.collection.update({
      _id: organizationId,
      'users.userId': newOwnerId
    }, {
      $set: {
        'users.$.role': UserMembership.ORG_OWNER
      }
    });

    Roles.removeUsersFromRoles(currOwnerId, OrgMemberRoles, organizationId);
    Roles.addUsersToRoles(newOwnerId, OrgOwnerRoles, organizationId);

    this.collection.update({
      _id: organizationId,
      'users.userId': currOwnerId
    }, {
      $set: {
        'users.$.role': UserMembership.ORG_MEMBER
      }
    });

    Roles.removeUsersFromRoles(currOwnerId, OrgOwnerRoles, organizationId);
    Roles.addUsersToRoles(currOwnerId, OrgMemberRoles, organizationId);

    this.collection.update({
      _id: organizationId,
    }, {
      $unset: { transfer: '' }
    });
  },

  cancelTransfer({ userId, organizationId }) {
    const isOrgOwner = !!this.collection.findOne({
      _id: organizationId,
      users: {
        $elemMatch: {
          userId,
          role: UserMembership.ORG_OWNER
        }
      }
    });

    if (!isOrgOwner) {
      throw new Meteor.Error(
        400, 'Only organization owner can cancel transfers'
      );
    }

    return this.collection.update({
      _id: organizationId,
    }, {
      $unset: { transfer: '' }
    });
  }
};
