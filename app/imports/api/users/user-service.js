import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { _ } from 'meteor/underscore';

import { getC } from '/imports/api/helpers';


export default {

  collection: Meteor.users,

  update(_id, { ...args }) {
    return this.collection.update({ _id }, {
      $set: args,
    });
  },

  remove({ _id }) {
    return this.collection.remove({ _id });
  },

  updateProfile(_id, { ...args }) {
    const updateDoc = {};

    _.each(args, (val, name) => {
      updateDoc[`profile.${name}`] = val;
    });

    return this.collection.update({ _id }, {
      $set: updateDoc,
    });
  },

  unsetProfileProperty({ _id, fieldName }) {
    return this.collection.update({ _id }, {
      $unset: { [`profile.${fieldName}`]: '' },
    });
  },

  updateEmail(_id, email) {
    if (!Meteor.isServer) {
      return;
    }

    const user = this.collection.findOne({ _id });
    const currEmail = user.email();

    Accounts.addEmail(_id, email, true);
    Accounts.removeEmail(_id, currEmail);
  },

  updatePhoneNumber({
    userId, _id, number, type,
  }) {
    return this.collection.update({
      _id: userId,
      'profile.phoneNumbers._id': _id,
    }, {
      $set: {
        'profile.phoneNumbers.$.number': number,
        'profile.phoneNumbers.$.type': type,
      },
    });
  },

  addPhoneNumber({
    userId, _id, number, type,
  }) {
    return this.collection.update({
      _id: userId,
    }, {
      $push: {
        'profile.phoneNumbers': { _id, number, type },
      },
    });
  },

  removePhoneNumber({ userId, _id }) {
    return this.collection.update({
      _id: userId,
    }, {
      $pull: {
        'profile.phoneNumbers': { _id },
      },
    });
  },

  setNotifications({ _id, enabled }) {
    const update = {
      $set: { 'preferences.areNotificationsEnabled': enabled },
    };

    if (enabled === false) {
      update.$unset = { 'preferences.notificationSound': '' };
    }

    return this.collection.update({ _id }, update);
  },

  setNotificationSound({ _id, soundFile }) {
    let update;
    if (soundFile) {
      update = {
        $set: { 'preferences.notificationSound': soundFile },
      };
    } else {
      update = {
        $unset: { 'preferences.notificationSound': '' },
      };
    }

    return this.collection.update({ _id }, update);
  },

  setEmailNotifications({ _id, enabled }) {
    const query = { _id };
    const modifier = {
      $set: {
        'preferences.areEmailNotificationsEnabled': enabled,
      },
    };

    return this.collection.update(query, modifier);
  },

};
