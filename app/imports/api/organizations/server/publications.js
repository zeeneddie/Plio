import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Organizations } from '../organizations.js';
import { Departments } from '../../departments/departments.js';
import { StandardTypes } from '../../standards-types/standards-types.js';
import {
  StandardsBookSections
} from '../../standards-book-sections/standards-book-sections.js';
import { Standards } from '../../standards/standards.js';
import { LessonsLearned } from '../../lessons/lessons.js';

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

const getUserOrganizations = (userId, orgSelector = {}, options = {}) => {
  const selector = {
    users: {
      $elemMatch: {
        userId,
        isRemoved: false,
        removedBy: { $exists: false },
        removedAt: { $exists: false }
      }
    }
  };

  _.extend(selector, orgSelector);

  return Organizations.find(selector, options);
};

Meteor.publish('currentUserOrganizations', function() {
  if (this.userId) {
    return getUserOrganizations(this.userId, {}, {
      fields: {
        name: 1,
        serialNumber: 1,
        users: 1
      }
    });
  } else {
    return this.ready();
  }
});

Meteor.publish('currentUserOrganizationById', function(_id) {
  if (this.userId) {
    return getUserOrganizations(this.userId, { _id });
  } else {
    return this.ready();
  }
});

Meteor.publish('currentUserOrganizationBySerialNumber', function(serialNumber) {
  if (this.userId) {
    return getUserOrganizations(this.userId, { serialNumber });
  } else {
    return this.ready();
  }
});

Meteor.publish('transferredOrganization', function(transferId) {
  const userId = this.userId;
  const organizationCursor = Organizations.find({
    'transfer._id': transferId,
  });
  const organization = organizationCursor.fetch()[0];

  if (userId && organization) {
    if (organization.transfer && organization.transfer.newOwnerId === userId) {
      return organizationCursor;
    } else {
      throw new Meteor.Error(403, 'Your account is not authorized for this action. Sign out and login as a proper user'); // 'Your account is not authorized for this action'
      return this.ready();
    }
  } else {
    throw new Meteor.Error(404, 'An invitation to transfer the organization is not found');
    return this.ready();
  }
});
