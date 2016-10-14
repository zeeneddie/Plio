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
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Risks } from '/imports/api/risks/risks.js';
import { Actions } from '/imports/api/actions/actions.js';
import { WorkItems } from '/imports/api/work-items/work-items.js';
import { getUserOrganizations } from '../utils.js';
import { isOrgMember } from '../../checkers';
import {
  StandardsListProjection,
  ActionsListProjection,
  NonConformitiesListProjection,
  RisksListProjection,
  WorkItemsListProjection
} from '/imports/api/constants.js';

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
  ]
});

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

// SUBSCRIBE ONLY IF YOU KNOW WHAT YOU'RE DOING. A LOT OF DATA.
Meteor.publish('GLOBAL_DEPS', function(organizationId) {
  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  const standards = Standards.find({ organizationId });
  const departments = Departments.find({ organizationId });
  const NCs = NonConformities.find({ organizationId });
  const risks = Risks.find({ organizationId });
  const actions = Actions.find({ organizationId });
  const workItems = WorkItems.find({ organizationId });

  return [
    standards,
    departments,
    NCs,
    risks,
    actions,
    workItems
  ];
});
