import { Meteor } from 'meteor/meteor';

import { UserSchema } from '/imports/share/schemas/user-schema.js';


Meteor.users.attachSchema(UserSchema);

Meteor.users.helpers({
  email() {
    return this.emails[0].address;
  },
  fullName() {
    const { firstName='', lastName='' } = this.profile;

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
  },
  fullNameOrEmail() {
    return this.fullName() || this.email();
  }
});
