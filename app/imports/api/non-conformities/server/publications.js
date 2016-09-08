import { Meteor } from 'meteor/meteor';

import { getJoinUserToOrganizationDate } from '/imports/api/organizations/utils.js';
import { NonConformities } from '../non-conformities.js';
import { Standards } from '/imports/api/standards/standards.js';
import { Files } from '/imports/api/files/files.js';
import { isOrgMember } from '../../checkers.js';
import Counter from '../../counter/server.js';

import get from 'lodash.get';


const getNCOtherFiles = (nc) => {
  let fileIds = nc.fileIds || [];
  const improvementPlanFileIds = get(nc, 'improvementPlan.fileIds');
  if (!!improvementPlanFileIds) {
    fileIds = fileIds.concat(improvementPlanFileIds);
  }

  return Files.find({ _id: { $in: fileIds } });
};

Meteor.publishComposite('nonConformities', function (organizationId, isDeleted = { $in: [null, false] }) {
  return {
    find() {
      const userId = this.userId;
      if (!userId || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      return NonConformities.find({ organizationId, isDeleted });
    },
    children: [{
      find(nc) {
        return getNCOtherFiles(nc);
      }
    }]
  }
});

Meteor.publishComposite('nonConformitiesByStandardId', function (standardId, isDeleted = { $in: [null, false] }) {
  return {
    find() {
      const userId = this.userId;
      const standard = Standards.findOne({ _id: standardId });
      const { organizationId } = !!standard && standard;

      if (!userId || !standard || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      return NonConformities.find({ standardsIds: standardId, isDeleted });
    },
    children: [{
      find(nc) {
        return getNCOtherFiles(nc);
      }
    }]
  }
});

Meteor.publishComposite('nonConformitiesByIds', function (ids = []) {
  return {
    find() {
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
    },
    children: [{
      find(nc) {
        return getNCOtherFiles(nc);
      }
    }]
  }
});

Meteor.publish('nonConformitiesCount', function (counterName, organizationId) {
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

  const currentOrgUserJoinedAt = getJoinUserToOrganizationDate({
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

  return new Counter(counterName, NonConformities.find(query));
});
