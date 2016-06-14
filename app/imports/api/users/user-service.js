import { Meteor } from 'meteor/meteor';


export default {

  collection: Meteor.users,

  update(_id, { ...args }) {
    return this.collection.update({ _id }, {
      $set: args
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
      $set: updateDoc
    });
  },

  unsetProfileProperty({ _id, fieldName }) {
    return this.collection.update({ _id }, {
      $unset: { [`profile.${fieldName}`]: '' }
    });
  },

  updateEmail(_id, email) {
    return this.collection.update({ _id }, {
      $set: {
        'emails.0.address': email
      }
    });
  },

  updatePhoneNumber({ userId, _id, number, type }) {
    return this.collection.update({
      _id: userId,
      'profile.phoneNumbers._id': _id
    }, {
      $set: {
        'profile.phoneNumbers.$.number': number,
        'profile.phoneNumbers.$.type': type
      }
    });
  },

  addPhoneNumber({ userId, _id, number, type }) {
    return this.collection.update({
      _id: userId
    }, {
      $push: {
        'profile.phoneNumbers': { _id, number, type }
      }
    });
  },

  removePhoneNumber({ userId, _id }) {
    return this.collection.update({
      _id: userId
    }, {
      $pull: {
        'profile.phoneNumbers': { _id }
      }
    });
  },

  setNotifications({ _id, enabled }) {
    const update = {
      $set: { 'preferences.areNotificationsEnabled': enabled }
    };

    if (enabled === false) {
      update['$unset'] = { 'preferences.notificationSound': '' };
    }

    return this.collection.update({ _id }, update);
  },

  setNotificationSound({ _id, soundFile }) {
    let update;
    if (soundFile) {
      update = {
        $set: { 'preferences.notificationSound': soundFile }
      };
    } else {
      update = {
        $unset: { 'preferences.notificationSound': '' }
      };
    }

    return this.collection.update({ _id }, update);
  }

};
