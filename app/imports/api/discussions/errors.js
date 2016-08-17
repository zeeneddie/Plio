import { Meteor } from 'meteor/meteor';

export default {
  CANNOT_CREATE_DISCUSSION_FOR_DELETED_DOCUMENT: new Meteor.Error(400, 'You cannot create discussions for deleted document')
};
