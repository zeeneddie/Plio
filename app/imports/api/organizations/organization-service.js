import { Meteor } from 'meteor/meteor';
import { Organizations } from './organizations.js';
import { OrganizationDefaults, UserMembership } from '../constants.js';

export default OrganizationService = {
  collection: Organizations,

  insert({name, ownerId}) {
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

    const { ncStepTimes, ncReminders, ncGuidelines } = OrganizationDefaults;

    return this.collection.insert({
      name,
      serialNumber,
      users: [{
        userId: ownerId,
        role: UserMembership.ORG_OWNER
      }],
      ncStepTimes,
      ncReminders,
      ncGuidelines
    });
  },

  update({_id, name, currency, ncStepTimes, ncReminders, ncGuidelines}) {
    return this.collection.update({_id}, {
      $set: {
        name, currency,
        ncStepTimes, ncReminders,
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

  setStepTime({_id, ncType, timeValue, timeUnit}) {
    return this.collection.update({ _id }, {
      $set: {
        [`ncStepTimes.${ncType}`]: {timeValue, timeUnit}
      }
    });
  },

  setReminder({_id, ncType, reminderType, timeValue, timeUnit}) {
    return this.collection.update({ _id }, {
      $set: {
        [`ncReminders.${ncType}.${reminderType}`]: {timeValue, timeUnit}
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
  }
};
