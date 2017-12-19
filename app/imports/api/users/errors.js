import { Meteor } from 'meteor/meteor';

export const USR_CANNOT_UPDATE_ANOTHER = new Meteor.Error(403, 'User cannot update another user');

export const USR_CANNOT_CHANGE_ROLES = new Meteor.Error(
  403,
  'User is not authorized for changing user\'s superpowers in this organization',
);

export const USR_CANNOT_CHANGE_ORG_OWNER_ROLES = new Meteor.Error(
  403,
  'Organization owner\'s superpowers cannot be changed',
);

export const USR_NOT_EXIST = new Meteor.Error(403, 'User does not exist');

export const USR_INCORRECT_PASSWORD = new Meteor.Error(403, 'Incorrect password');
