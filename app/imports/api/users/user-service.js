import { Meteor } from 'meteor/meteor';

export default {

  collection: Meteor.users,

  update(_id, fields) {
    return this.collection.update({ _id }, {
      $set: fields
    });
  }

};
