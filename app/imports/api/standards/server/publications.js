import { Meteor } from 'meteor/meteor';
import { Standards } from '../standards.js';
import { isOrgMember } from '../../checkers.js';
import { Files } from '/imports/api/files/files.js';
import Counter from '../../counter/server.js';

const getStandardFiles = (standard) => {
  const fileIds = standard.improvementPlan && standard.improvementPlan.fileIds || [];
  return Files.find({ _id: { $in: fileIds } });
};

Meteor.publishComposite('standards', function(organizationId) {
  return {
    find() {
      const userId = this.userId;
      if (!userId || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      return Standards.find({
        organizationId,
        isDeleted: { $in: [false, null] }
      });
    },
    children: [{
      find(standard) {
        return getStandardFiles(standard);
      }
    }]
  }
});

Meteor.publishComposite('standardsDeleted', function(organizationId) {
  return {
    find() {
      const userId = this.userId;
      if (!userId || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      return Standards.find({ organizationId, isDeleted: true });
    },
    children: [{
      find(standard) {
        return getStandardFiles(standard);
      }
    }]
  }
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
