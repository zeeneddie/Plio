import { Meteor } from 'meteor/meteor';
import curry from 'lodash.curry';

import { getJoinUserToOrganizationDate, getUserOrganizations } from '/imports/api/organizations/utils.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { Standards } from '../standards.js';
import { isOrgMember, isOrgMemberBySelector } from '../../checkers.js';
import { Files } from '/imports/api/files/files.js';
import { LessonsLearned } from '/imports/api/lessons/lessons.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Risks } from '/imports/api/risks/risks.js';
import { Actions } from '/imports/api/actions/actions.js';
import { WorkItems } from '/imports/api/work-items/work-items.js';
import { Departments } from '/imports/api/departments/departments';
import Counter from '../../counter/server.js';
import {
  StandardsListProjection,
  ActionsListProjection,
  NonConformitiesListProjection,
  RisksListProjection,
  WorkItemsListProjection,
  StandardsBookSectionsListProjection,
  StandardTypesListProjection,
  DepartmentsListProjection
} from '/imports/api/constants.js';
import get from 'lodash.get';
import property from 'lodash.property';
import { check, Match } from 'meteor/check';
import { StandardsBookSections } from '../../standards-book-sections/standards-book-sections';
import { StandardTypes } from '../../standards-types/standards-types';
import { getPublishCompositeOrganizationUsers, explainMongoQuery } from '../../helpers';

const getStandardFiles = (standard) => {
  const fileIds = standard.improvementPlan && standard.improvementPlan.fileIds || [];
  const source1FileId = get(standard, 'source1.fileId');
  const source2FileId = get(standard, 'source2.fileId');
  source1FileId && fileIds.push(source1FileId);
  source2FileId && fileIds.push(source2FileId);

  return Files.find({ _id: { $in: fileIds } });
};

const getStandardsLayoutPub = function(userId, serialNumber, isDeleted) {
  const standardsFields = {
    title: 1,
    sectionId: 1,
    typeId: 1,
    organizationId: 1,
    nestingLevel: 1,
    ...(() => _.isObject(isDeleted)
      ? null
      : { isDeleted: 1, deletedAt: 1, deletedBy: 1 }
    )()
  };

  const pubs = [
    {
      find({ _id:organizationId }) {
        return StandardsBookSections.find({ organizationId }, {
          fields: StandardsBookSectionsListProjection
        });
      }
    },
    {
      find({ _id:organizationId }) {
        return StandardTypes.find({ organizationId }, {
          fields: StandardTypesListProjection
        });
      }
    },
    {
      find({ _id:organizationId }) {
        return Standards.find({ organizationId, isDeleted }, {
          fields: standardsFields
        });
      }
    }
  ];

  return pubs;
};

Meteor.publishComposite('standardsLayout', getPublishCompositeOrganizationUsers(getStandardsLayoutPub));

Meteor.publishComposite('standardsList', function(organizationId, isDeleted = { $in: [null, false] }) {
  return {
    find() {
      const userId = this.userId;

      if (!userId || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      return Standards.find({
        organizationId,
        isDeleted
      }, { fields: StandardsListProjection });
    }
  }
});

Meteor.publishComposite('standardCard', function({ _id, organizationId }) {
  const problemsFields = {
    organizationId: 1,
    sequentialId: 1,
    serialNumber: 1,
    title: 1,
    standardsIds: 1,
    status: 1
  };

  const actionsFields = {
    ..._.omit(problemsFields, 'standardsIds'),
    linkedTo: 1,
    type: 1
  };

  const WKFields = {
    linkedDoc: 1,
    isCompleted: 1,
    assigneeId: 1
  };

  const makeQuery = query => ({ ...query, isDeleted: { $in: [null, false] } });
  const makeOptions = fields => ({ fields });

  const getCursorByQueryAndFields = curry((collection, query, fields) =>
    collection.find(makeQuery(query), makeOptions(fields)));

  const getProblems = collection => ({ _id: standardsIds }) =>
    getCursorByQueryAndFields(collection, { standardsIds }, problemsFields);

  const getActions = ({ _id }) =>
    getCursorByQueryAndFields(Actions, { 'linkedTo.documentId': _id }, actionsFields);

  const getWorkItems = ({ _id }) =>
    getCursorByQueryAndFields(WorkItems, { 'linkedDoc._id': _id  }, WKFields);

  const createProblemsTree = (collection) => ({
    find: getProblems(collection),
    children: [
      {
        find: getActions,
        children: [
          {
            find: getWorkItems
          }
        ]
      },
      {
        find: getWorkItems
      }
    ]
  });

  return {
    find() {
      const userId = this.userId;

      if (!userId || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      return Standards.find({
        _id,
        organizationId
      });
    },
    children: [
      {
        find({ organizationId, departmentsIds = [] }) {
          const query = {
            organizationId,
            _id: {
              $in: departmentsIds
            }
          };
          const options = makeOptions(DepartmentsListProjection);

          return Departments.find(query, options);
        }
      },
      {
        find(standard) {
          return getStandardFiles(standard);
        }
      },
      {
        find({ _id }) {
          return LessonsLearned.find({ documentId: _id });
        }
      },
      createProblemsTree(NonConformities),
      createProblemsTree(Risks)
    ]
  }
});

Meteor.publish('standardsCount', function (counterName, organizationId) {
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

  const currentOrgUserJoinedAt = getJoinUserToOrganizationDate({
    organizationId, userId
  });
  const query = {
    organizationId,
    viewedBy: { $ne: userId },
    isDeleted: { $in: [false, null] }
  };

  if (currentOrgUserJoinedAt) {
    query.createdAt = { $gt: currentOrgUserJoinedAt };
  }

  return new Counter(counterName, Standards.find(query));
});
