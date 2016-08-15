import { Meteor } from 'meteor/meteor';

export const CANNOT_CREATE_MESSAGE_FOR_DELETED = new Meteor.Error(400, 'You cannot add messages to deleted document');

export const ONLY_OWNER_CAN_UPDATE = new Meteor.Error(400, 'Only an owner of the message can update it');
