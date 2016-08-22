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
import Utils from '../../core/utils.js';
import OrgNotificationsSender from './org-notifications-sender.js';

export default OrganizationService = {
  collection: Organizations,

  insert({ name, timezone, currency, ownerId }) {
    const serialNumber = Utils.generateSerialNumber(this.collection, {}, 100);

    const { workflowDefaults, reminders, ncGuidelines, rkGuidelines, rkScoringGuidelines } = OrganizationDefaults;

    const organizationId = this.collection.insert({
      name,
      timezone,
      currency,
      serialNumber,
      users: [{
        userId: ownerId,
        role: UserMembership.ORG_OWNER
      }],
      workflowDefaults,
      reminders,
      ncGuidelines,
      rkGuidelines,
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

  remove() {

  },

  setName({ _id, name }) {
    return this.collection.update({ _id }, {
      $set: { name }
    });
  },

  setTimezone({ _id, timezone }) {
    return this.collection.update({ _id }, {
      $set: { timezone }
    });
  },

  setDefaultCurrency({ _id, currency }) {
    return this.collection.update({ _id }, {
      $set: { currency }
    });
  },

  setWorkflowDefaults({ _id, type, ...args }) {
    const $set = {};
    for (let key in args) {
      $set[`workflowDefaults.${type}.${key}`] = args[key];
    }

    return this.collection.update({ _id }, { $set });
  },

  setReminder({ _id, type, reminderType, timeValue, timeUnit }) {
    return this.collection.update({ _id }, {
      $set: {
        [`reminders.${type}.${reminderType}`]: {timeValue, timeUnit}
      }
    });
  },

  setNCGuideline({_id, type, text}) {
    return this.collection.update({ _id }, {
      $set: {
        [`ncGuidelines.${type}`]: text
      }
    });
  },

  setRKGuideline({ _id, type, text }) {
    const query = { _id };
    const options = {
      $set: {
        [`rkGuidelines.${type}`]: text
      }
    };
    return this.collection.update(query, options);
  },

  setRKScoringGuidelines({ _id, rkScoringGuidelines }) {
    const query = { _id };
    const options = { $set: { rkScoringGuidelines } };
    return this.collection.update(query, options);
  },

  removeUser({ userId, organizationId, removedBy }) {
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

  createTransfer({ organizationId, newOwnerId, currOwnerId }) {
    const transferId = Random.id();

    new OrgNotificationsSender(organizationId).sendOwnershipInvite(newOwnerId, transferId);

    return this.collection.update({
      _id: organizationId,
    }, {
      $set: {
        transfer: {
          newOwnerId,
          _id: transferId,
          createdAt: new Date()
        }
      }
    });
  },

  transfer({ newOwnerId, transferId }, organization) {
    const organizationId = organization._id;
    const currOwnerId = organization.ownerId();

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

  cancelTransfer({ organizationId }) {
    return this.collection.update({
      _id: organizationId,
    }, {
      $unset: { transfer: '' }
    });
  }
};
