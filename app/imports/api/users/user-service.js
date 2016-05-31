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

  updateEmail(_id, email) {
    return this.collection.update({ _id }, {
      $set: {
        'emails.0.address': email
      }
    });
  },

  updatePhoneNumber(_id, { index, ...args }) {
    return this._updateArrayElement(
      _id, 'profile.phoneNumbers', index, args
    );
  },

  addPhoneNumber(_id, { ...args }) {
    return this._pushArrayElement(_id, 'profile.phoneNumbers', args);
  },

  _updateArrayElement(_id, arrField, index, args) {
    const updateDoc = {};

    _.each(args, (val, name) => {
      updateDoc[`${arrField}.${index}.${name}`] = val;
    });

    return this.collection.update({ _id }, {
      $set: updateDoc
    });
  },

  _pushArrayElement(_id, fieldName, args) {
    return this.collection.update({ _id }, {
      $push: {
        [fieldName]: args
      }
    });
  },

};
