import { Meteor } from 'meteor/meteor';

export default {
  update({ selectedOrganizationSerialNumber }) {
    const userId = this.userId;
    Meteor.users.update(userId, {
      $set: {
        selectedOrganizationSerialNumber
      }
    });
  }
};
