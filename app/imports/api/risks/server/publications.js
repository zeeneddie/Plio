import { Meteor } from 'meteor/meteor';
import { Risks } from '../risks.js';
import { Standards } from '/imports/api/standards/standards.js';
import { isOrgMember } from '../../checkers.js';
import Counter from '../../counter/server.js';

Meteor.publish('risks', function(organizationId, isDeleted = { $in: [null, false] }) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return Risks.find({ organizationId, isDeleted });
});

Meteor.publish('risksByStandardId', function(standardId, isDeleted = { $in: [null, false] }) {
  const userId = this.userId;
  const standard = Standards.findOne({ _id: standardId });
  const { organizationId } = !!standard && standard;

  if (!userId || !standard || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return Risks.find({ standardId, isDeleted });
});

Meteor.publish('risksByIds', function(ids = []) {
  let query = {
    _id: { $in: ids },
    isDeleted: { $in: [null, false] }
  };

  const userId = this.userId;
  const { organizationId } = Object.assign({}, Risks.findOne({ ...query }));

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  query = { ...query, organizationId };

  return Risks.find(query);
});

Meteor.publish('risksCount', function(counterName, organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, Risks.find({
    organizationId,
    isDeleted: { $in: [false, null] }
  }));
});

Meteor.publish('risksNotViewedCount', function(counterName, organizationId) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, Risks.find({
    organizationId,
    viewedBy: { $ne: userId },
    isDeleted: { $in: [false, null] }
  }));
});
