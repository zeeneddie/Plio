import { Meteor } from 'meteor/meteor';

import { getJoinUserToOrganisationDate } from '/imports/api/organizations/utils.js';
import { WorkItems } from '../work-items.js';
import { isOrgMember } from '../../checkers.js';
import Counter from '../../counter/server.js';


Meteor.publish('workItems', function(organizationId, isDeleted = { $in: [null, false] }) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }
  return WorkItems.find({ organizationId, isDeleted });
});

Meteor.publish('workItemsOverdue', function(organizationId, limit) {
  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  const query = {
    organizationId,
    assigneeId: userId,
    isDeleted: { $in: [null, false] },
    status: 2 // overdue
  };
  const options = {
    sort: { targetDate: -1 }
  };

  // Check if limit is an integer number
  if (Number(limit) === limit && limit % 1 === 0) {
    options.limit = limit;
  }

  return WorkItems.find(query, options);
});

Meteor.publish('workItemsCount', function(counterName, organizationId) {
  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, WorkItems.find({
    organizationId,
    isDeleted: { $in: [false, null] }
  }));
});

Meteor.publish('workItemsNotViewedCount', function(counterName, organizationId) {
  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  const currentOrgUserJoinedAt = getJoinUserToOrganisationDate({
    organizationId, userId
  });
  const query = {
    organizationId,
    viewedBy: { $ne: userId },
    isDeleted: { $in: [false, null] }
  };

  if(currentOrgUserJoinedAt){
    query.createdAt = { $gt: currentOrgUserJoinedAt };
  }

  return new Counter(counterName, WorkItems.find(query));
});

Meteor.publish('workItemsOverdueCount', function(counterName, organizationId) {
  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, WorkItems.find({
    organizationId,
    assigneeId: userId,
    status: 2,
    isDeleted: { $in: [false, null] }
  }));
});
