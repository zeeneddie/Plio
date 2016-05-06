import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Organizations } from '../organizations.js';
import { Departments } from '../../departments/departments.js';
import { StandardsTypes } from '../../standards-types/standards-types.js';
import {
  StandardsBookSections
} from '../../standards-book-sections/standards-book-sections.js';


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
    Organizations.find({'users.userId': invitedUserId}, {
      limit: 1,
      fields: {name: 1, serialNumber: 1}
    })
  ]
});


Meteor.publishComposite('currentUserOrganizations', {
  find: function () {
    return Organizations.find({'users.userId': this.userId});
  },
  children: [{
    find: function (org) {
      return Departments.find({
        organizationId: org._id
      });
    }
  }, {
    find: function (org) {
      return StandardsTypes.find({
        organizationId: org._id
      });
    }
  }, {
    find: function (org) {
      return StandardsBookSections.find({
        organizationId: org._id
      });
    }
  }]
});

Meteor.publishComposite('currentUserOrganizationById', {
  find: function (orgId) {
    return Organizations.find({_id: orgId, 'users.userId': this.userId});
  },
  children: [{
    find: function (org) {
      return Departments.find({
        organizationId: org._id
      });
    }
  }, {
    find: function (org) {
      return StandardsTypes.find({
        organizationId: org._id
      });
    }
  }, {
    find: function (org) {
      return StandardsBookSections.find({
        organizationId: org._id
      });
    }
  }]
});
