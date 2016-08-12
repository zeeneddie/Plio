import { Meteor } from 'meteor/meteor';
import { NonConformities } from '../non-conformities.js';
import { Standards } from '/imports/api/standards/standards.js';
import { isOrgMember } from '../../checkers.js';
import Counter from '../../counter/server.js';

Meteor.publish('nonConformities', function(organizationId, isDeleted = { $in: [null, false] }) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return NonConformities.find({ organizationId, isDeleted });
});

Meteor.publish('nonConformitiesByStandardId', function(standardId, isDeleted = { $in: [null, false] }) {
  const userId = this.userId;
  const standard = Standards.findOne({ _id: standardId });
  const { organizationId } = !!standard && standard;

  if (!userId || !standard || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return NonConformities.find({ standardsIds: standardId, isDeleted });
});

Meteor.publish('nonConformitiesByIds', function(ids = []) {
  let query = {
    _id: { $in: ids },
    isDeleted: { $in: [null, false] }
  };

  const userId = this.userId;
  const { organizationId } = Object.assign({}, NonConformities.findOne(query));

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  query = { ...query, organizationId };

  return NonConformities.find(query);
});

Meteor.publish('nonConformitiesCount', function(counterName, organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, NonConformities.find({
    organizationId,
    isDeleted: { $in: [false, null] }
  }));
});

Meteor.publish('nonConformitiesNotViewedCount', function(counterName, organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, NonConformities.find({
    organizationId,
    viewedBy: { $ne: userId },
    isDeleted: { $in: [false, null] }
  }));
});
