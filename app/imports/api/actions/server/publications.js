import { Meteor } from 'meteor/meteor';
import { Actions } from '../actions.js';
import { isOrgMember } from '../../checkers.js';
import Counter from '../../counter/server.js';


Meteor.publish('actions', function(organizationId, isDeleted = { $in: [null, false] }) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return Actions.find({
    organizationId,
    isDeleted
  });
});

Meteor.publish('actionsByIds', function(ids = []) {
  let query = {
    _id: { $in: ids },
    isDeleted: { $in: [null, false] }
  };

  const { organizationId } = Object.assign({}, Actions.findOne(query));
  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  query = { ...query, organizationId };

  return Actions.find(query);
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
