import { Meteor } from 'meteor/meteor';


export const CANNOT_CHANGE_HELP_DOCS = new Meteor.Error(400, 'You are not authorized for creating, removing or editing help documents');
