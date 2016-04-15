import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Organizations } from './organizations.js';
import { UserRoles } from '../constants.js';

// export const insert = new ValidatedMethod({
//   name: 'Organizations.insert',
//   validate: new SimpleSchema({
//     name: { type: String }
//   }).validator(),
//   run({ name }) {
//     const userId = this.userId;
//     const userDoc = {
//       userId,
//       role: UserRoles.OWNER
//     };
//
//     return Organizations.insert({
//       name,
//       users: [userDoc]
//     });
//   }
// });
