import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

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


export default OrganizationService = {
  collection: Organizations,

  insert({name, ownerId, currency}) {
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

    const { workflowDefaults, reminders, ncGuidelines } = OrganizationDefaults;

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
      ncGuidelines
    });

    _.each(DefaultStandardTypes, ({ name, abbreviation }) => {
      StandardsTypeService.insert({
        name,
        abbreviation,
        organizationId
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

  transfer({ organizationId, newOwnerId, currOwnerId }) {
    if (currOwnerId === newOwnerId) {
      throw new Meteor.Error(
        400, 'New owner already owns transferred organization'
      );
    }

    const isOrgMember = !!this.collection.findOne({
      _id: organizationId,
      users: {
        $elemMatch: {
          userId: newOwnerId,
          role: UserMembership.ORG_MEMBER
        }
      }
    });

    if (!isOrgMember) {
      throw new Meteor.Error(
        400, 'New owner must be a member of transferred organization'
      );
    }

    this.collection.update({
      _id: organizationId,
      'users.userId': newOwnerId
    }, {
      $set: {
        'users.$.role': UserMembership.ORG_OWNER
      }
    });

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
  }
};
