import { Meteor } from 'meteor/meteor';

export const DSC_CANNOT_CREATE_FOR_DELETED_DOCUMENT = new Meteor.Error(400, 'You cannot create discussions for deleted document');

export const DSC_CANNOT_SET_EARLIER_DATE = new Meteor.Error(400, 'You cannot update "viewedUpTo" field with a date earlier than the existing one');
