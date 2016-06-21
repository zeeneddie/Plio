import { Meteor } from 'meteor/meteor';
import { Standards } from '../standards.js';
import { isOrgMember } from '../../checkers.js';
import Counter from '../../counter/server.js';


Meteor.publish('standards', function(organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return Standards.find({
    organizationId,
    isDeleted: { $in: [false, null] }
  });
});

Meteor.publish('standardsDeleted', function(organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return Standards.find({ organizationId, isDeleted: true });
});

Meteor.publish('standardsCount', function(counterName, organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, Standards.find({
    organizationId,
    isDeleted: { $in: [false, null] }
  }));
});

Meteor.publish('standardsNotViewedCount', function(counterName, organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, Standards.find({
    organizationId,
    viewedBy: { $ne: userId },
    isDeleted: { $in: [false, null] }
  }));
});
