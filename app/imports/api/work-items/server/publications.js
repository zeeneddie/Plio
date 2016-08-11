import { Meteor } from 'meteor/meteor';
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

Meteor.publish('workItemsOverdue', function(organizationId, limit = 5) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  const query = {
    organizationId,
    isDeleted: { $in: [null, false] },
    status: 2 // overdue
  };
  const options = {
    limit,
    sort: { targetDate: -1 }
  };

  Meteor._sleepForMs(500);

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

  return new Counter(counterName, WorkItems.find({
    organizationId,
    viewedBy: { $ne: userId },
    isDeleted: { $in: [false, null] }
  }));
});
