import { Organizations } from './organizations.js';
import { UserRoles } from '../constants.js';


export default OrganizationService = {

  collection: Organizations,

  insert({ name, ownerId }) {
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

    return this.collection.insert({
      name,
      serialNumber,
      users: [{
        userId: ownerId,
        role: UserRoles.OWNER
      }]
    });
  },

  update({ _id, name, currency, ncStepTimes, ncReminders, ncGuidelines }) {
    return this.collection.update({ _id }, {
      $set: {
        name, currency,
        ncStepTimes, ncReminders,
        ncGuidelines
      }
    });
  },

  remove() {

  },

  setName({ _id, name }) {
    return this._update(_id, { name });
  },

  setDefaultCurrency({ _id, currency }) {
    return this._update(_id, { currency });
  },

  setStepTime({ _id, ncType, timeValue, timeUnit }) {
    return this._update(_id, {
      [`ncStepTimes.${ncType}`]: { timeValue, timeUnit }
    });
  },

  setReminder({ _id, ncType, reminderType, timeValue, timeUnit }) {
    return this._update(_id, {
      [`ncReminders.${ncType}.${reminderType}`]: { timeValue, timeUnit }
    });
  },

  setGuideline({ _id, ncType, text }) {
    return this._update(_id, {
      [`ncGuidelines.${ncType}`]: { text }
    });
  },

  _update(_id, fields) {
    return this.collection.update({ _id }, {
      $set: fields
    });
  }

};
