import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { check } from 'meteor/check';

import { Organizations } from '/imports/share/collections/organizations';
import { Departments } from '/imports/share/collections/departments';
import { StandardTypes } from '/imports/share/collections/standards-types';
import {
  StandardsBookSections
} from '/imports/share/collections/standards-book-sections';
import { Standards } from '/imports/share/collections/standards';
import { LessonsLearned } from '/imports/share/collections/lessons';
import { RiskTypes } from '/imports/share/collections/risk-types';
import { getUserOrganizations } from '../utils';
import { isOrgMember } from '../../checkers';
import {
  StandardsBookSectionsListProjection,
  StandardTypesListProjection
} from '../../constants';
import { makeOptionsFields } from '../../helpers';

Meteor.publish('invitationInfo', function (invitationId) {
  const sendInternalError = (message) => this.error(new Meteor.Error(500, message));

  if (!SimpleSchema.RegEx.Id.test(invitationId)) {
    sendInternalError('Incorrect invitation ID!');
    return;
  }

  const invitedUserCursor = Meteor.users.find({
    invitationId: invitationId
  }, {
    fields: { emails: 1, invitationId: 1, invitationOrgId: 1 }
  });

  if (invitedUserCursor.count() === 0) {
    sendInternalError('Invitation do not exist');
    return;
  }

  const { _id:invitedUserId, invitationOrgId } = invitedUserCursor.fetch()[0];

  return [
    invitedUserCursor,
    Organizations.find({
      _id: invitationOrgId,
      'users.userId': invitedUserId
    }, {
      limit: 1,
      fields: {name: 1, serialNumber: 1}
    })
  ];
});

Meteor.publish('currentUserOrganizations', function() {
  if (this.userId) {
    return getUserOrganizations(this.userId, {}, {
      fields: {
        name: 1,
        serialNumber: 1
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

Meteor.publish('organizationDeps', function(organizationId) {
  check(organizationId, String);

  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  const organization = Organizations.findOne({ _id: organizationId });
  const userIds = _.pluck(organization.users, 'userId');
  const query = { organizationId };

  const standardsBookSections = StandardsBookSections.find(query, makeOptionsFields(StandardsBookSectionsListProjection));
  const standardsTypes = StandardTypes.find(query, makeOptionsFields(StandardTypesListProjection));
  const riskTypes = RiskTypes.find(query);
  const users = Meteor.users.find({ _id: { $in: userIds } });

  return [
    standardsBookSections,
    standardsTypes,
    riskTypes,
    users
  ];
});
