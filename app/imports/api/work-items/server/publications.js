import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';

import { getJoinUserToOrganizationDate } from '/imports/api/organizations/utils';
import { WorkItems } from '/imports/share/collections/work-items';
import { RiskTypes } from '/imports/share/collections/risk-types';
import { Departments } from '/imports/share/collections/departments';
import { Standards } from '/imports/share/collections/standards';
import { Actions } from '/imports/share/collections/actions';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { Risks } from '/imports/share/collections/risks';
import { isOrgMember } from '../../checkers';
import {
  WorkItemsListProjection,
  DepartmentsListProjection,
} from '/imports/api/constants';
import Counter from '../../counter/server';
import {
  getPublishCompositeOrganizationUsers,
  getCursorNonDeleted,
  makeOptionsFields,
  getRequiredFieldsByCollection,
  getC,
} from '../../helpers';
import { getCollectionByDocType } from '/imports/share/helpers';
import { ActionTypes } from '/imports/share/constants';
import { createNonConformityCardPublicationTree } from '../../non-conformities/utils';
import { createRiskCardPublicationTree } from '../../risks/utils';
import { createActionCardPublicationTree } from '../../actions/utils';
import { getProblemsWithLimitedFields } from '../../problems/utils';

const getWorkInboxLayoutPub = (userId, serialNumber, isDeleted) => [
  {
    find({ _id: organizationId }) {
      const query = { organizationId, isDeleted };

      return WorkItems.find(query, makeOptionsFields(WorkItemsListProjection));
    },
    children: [
      {
        find({ organizationId, linkedDoc: { _id, type } = {} }) {
          const collection = getCollectionByDocType(type);
          const query = { _id, organizationId };
          const fields = getRequiredFieldsByCollection(collection);

          if (isDeleted && _.values(ActionTypes).includes(type)) {
            return collection.find(query, { fields });
          }

          return getCursorNonDeleted(query, fields, collection);
        },
      },
    ],
  },
];

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
  check(_id, String);
  check(organizationId, String);

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

const createRelativeCardPublicationTree = (collection) => {
  const getQuery = getC('linkedDoc._id');

  switch (collection) {
    case NonConformities:
      return createNonConformityCardPublicationTree(getQuery);
    case Risks:
      return createRiskCardPublicationTree(getQuery);
    case Actions:
      return createActionCardPublicationTree(getQuery);
    default:
      return [];
  }
};

Meteor.publishComposite('workInboxCard', function({ _id, organizationId }) {
  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  const WKCursor = WorkItems.find({ _id, organizationId });
  const {
    linkedDoc: {
      type: docType,
    } = {},
  } = Object.assign({}, _.first(WKCursor.fetch()));
  const collection = getCollectionByDocType(docType);

  return {
    find() {
      return WKCursor;
    },
    children: [
      createRelativeCardPublicationTree(collection),
    ],
  };
});

Meteor.publish('workInboxDeps', function(organizationId) {
  const query = { organizationId };
  const standardsFields = {
    title: 1,
    status: 1,
    organizationId: 1,
  };

  const getProblems = getProblemsWithLimitedFields(query);

  const departments = Departments.find(query, makeOptionsFields(DepartmentsListProjection));
  const standards = getCursorNonDeleted(query, standardsFields, Standards);
  const riskTypes = RiskTypes.find(query);
  const NCs = getProblems(NonConformities);
  const risks = getProblems(Risks);

  return [
    departments,
    standards,
    NCs,
    risks,
    riskTypes
  ];
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
