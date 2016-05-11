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

  deleteUser({ userId, organizationId, deletedBy }) {
    this.collection.update({
      _id: organizationId,
      'users.userId': userId
    }, {
      $set: {
        'users.$.deletedBy': deletedBy
      }
    });
  }
};
