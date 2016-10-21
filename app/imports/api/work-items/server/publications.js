import { Meteor } from 'meteor/meteor';

import { getJoinUserToOrganizationDate } from '/imports/api/organizations/utils.js';
import { WorkItems } from '/imports/share/collections/work-items.js';
import { isOrgMember } from '../../checkers.js';
import {
  ActionsListProjection,
  NonConformitiesListProjection,
  RisksListProjection,
  WorkItemsListProjection
} from '/imports/api/constants.js';
import Counter from '../../counter/server.js';
import { getPublishCompositeOrganizationUsers } from '../../helpers';

const getWorkInboxLayoutPub = (userId, serialNumber, isDeleted) => {
  const makeQuery = (organizationId) => ({
    organizationId,
    isDeleted: { $in: [null, false] }
  });
  const makeOptions = (projection) => ({
    fields: projection
  });

  return [
    {
      find({ _id:organizationId }) {
        const query = { organizationId, isDeleted };

        return WorkItems.find(query, makeOptions(WorkItemsListProjection));
      }
    },
    {
      find({ _id:organizationId }) {
        return Actions.find(makeQuery(organizationId), makeOptions(ActionsListProjection));
      }
    },
    {
      find({ _id:organizationId }) {
        return NonConformities.find(makeQuery(organizationId), makeOptions(NonConformitiesListProjection));
      }
    },
    {
      find({ _id:organizationId }) {
        return Risks.find(makeQuery(organizationId), makeOptions(RisksListProjection));
      }
    }
  ]
};

Meteor.publishComposite('workInboxLayout', getPublishCompositeOrganizationUsers(getWorkInboxLayoutPub));

Meteor.publish('workItemsList', function(organizationId, isDeleted = { $in: [null, false] }) {
  const userId = this.userId;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }
  return WorkItems.find({ organizationId, isDeleted }, {
    fields: WorkItemsListProjection
  });
});

Meteor.publishComposite('workItemCard', function({ _id, organizationId }) {
  return {
    find() {
      const userId = this.userId;
      if (!userId || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }
      return WorkItems.find({ _id, organizationId });
    }
  }
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

  const query = {
    organizationId,
    isDeleted: { $in: [false, null] }
  };
  const cursor = WorkItems.find(query);

  return new Counter(counterName, cursor);
});

Meteor.publish('workItemsNotViewedCount', function(counterName, organizationId) {
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
    isCompleted: false,
    isDeleted: { $in: [false, null] }
  };

  if(currentOrgUserJoinedAt){
    query.createdAt = { $gt: currentOrgUserJoinedAt };
  }

  const cursor = WorkItems.find(query);

  return new Counter(counterName, cursor);
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
