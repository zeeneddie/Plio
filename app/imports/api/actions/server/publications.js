import { Meteor } from 'meteor/meteor';
import { Actions } from '../actions.js';
import { isOrgMember } from '../../checkers.js';
import Counter from '../../counter/server.js';


Meteor.publish('actions', function(organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return Actions.find({
    organizationId,
    isDeleted: { $in: [false, null] }
  });
});

Meteor.publish('actionsCount', function(counterName, organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, Actions.find({
    organizationId,
    isDeleted: { $in: [false, null] }
  }));
});

Meteor.publish('actionsNotViewedCount', function(counterName, organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, Actions.find({
    organizationId,
    viewedBy: { $ne: userId },
    isDeleted: { $in: [false, null] }
  }));
});

Meteor.publish('myCurrentFailedActions', function(counterName, organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, Actions.find({
    organizationId,
    status: { $in: [2, 5, 6] },
    $or: [
      { toBeCompletedBy: userId, isCompleted: false },
      { toBeVerifiedBy: userId, isVerified: false }
    ]
  }));
});
