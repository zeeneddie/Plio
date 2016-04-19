import { Meteor } from 'meteor/meteor';

export default {
  update({ selectedOrganizationSerialNumber, userId }) {
    Meteor.users.update(userId, {
      $set: {
        selectedOrganizationSerialNumber
      }
    });
  }
};
