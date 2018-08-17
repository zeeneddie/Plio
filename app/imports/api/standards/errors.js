import { Meteor } from 'meteor/meteor';

export const CANNOT_CHANGE_STANDARDS = new Meteor.Error(
  400,
  'You are not authorized for creating, removing or editing standards',
);
