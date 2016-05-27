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

Meteor.publish('currentUserOrganizations', function() {
  if (this.userId) {
    return Organizations.find({
      users: {
        $elemMatch: {
          userId: this.userId,
          isRemoved: false,
          removedBy: { $exists: false },
          removedAt: { $exists: false }
        }
      }
    }, {
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
    return Organizations.find({
      _id,
      users: {
        $elemMatch: {
          userId: this.userId,
          isRemoved: false,
          removedBy: { $exists: false },
          removedAt: { $exists: false }
        }
      }
    });
  } else {
    return this.ready();
  }
});

Meteor.publish('currentUserOrganizationBySerialNumber', function(serialNumber) {
  if (this.userId) {
    return Organizations.find({
      serialNumber,
      users: {
        $elemMatch: {
          userId: this.userId,
          isRemoved: false,
          removedBy: { $exists: false },
          removedAt: { $exists: false }
        }
      }
    });
  } else {
    return this.ready();
  }
});
