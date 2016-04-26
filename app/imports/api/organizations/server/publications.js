import { Meteor } from 'meteor/meteor';
import { Organizations } from '../organizations';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

Meteor.publish('currentUserOrganizations', function () {
  return Organizations.find({'users.userId': this.userId});
});


Meteor.publish('invitationInfo', function (invitationId) {
  const sendInternalError = (message) => this.error(new Meteor.Error(500, message));

  if (!SimpleSchema.RegEx.Id.test(invitationId)) {
    sendInternalError('Incorrect invitation ID!');
    return;
  }
  
  const invitedUserCursor = Meteor.users.find({invitationId: invitationId}, {fields: {emails: 1, invitationId: 1}});

  if (invitedUserCursor.count() === 0) {
    sendInternalError('Invitation do not exist');
    return;
  }

  let invitedUserId = invitedUserCursor.fetch()[0]._id;
  return [
    invitedUserCursor,
    Organizations.find({'users.userId': invitedUserId}, {limit: 1, fields: {name: 1}})
  ]
});
