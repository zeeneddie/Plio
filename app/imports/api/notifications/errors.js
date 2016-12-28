import { Meteor } from 'meteor/meteor';

export const DOC_NOT_FOUND_OR_ALREADY_UNSUBSCRIBED = new Meteor.Error(400, 'The document you are looking for is not found or you\'ve already unsubscribed from notifications of this document');
