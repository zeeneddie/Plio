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
  DepartmentsListProjection,
  ActionTypes
} from '/imports/api/constants.js';
import get from 'lodash.get';
import property from 'lodash.property';
import { check, Match } from 'meteor/check';
import { StandardsBookSections } from '../../standards-book-sections/standards-book-sections';
import { StandardTypes } from '../../standards-types/standards-types';
import {
  getPublishCompositeOrganizationUsers,
  makeOptionsFields,
  getCursorOfNonDeletedWithFields,
  toObjFind
} from '../../helpers';
import { getDepartmentsCursorByIds } from '../../departments/utils';
import { getActionsCursorByLinkedDoc, getActionsWithLimitedFields } from '../../actions/utils';
import { getWorkItemsCursorByIdsWithLimitedFields } from '../../work-items/utils';
import { createProblemsTree, getProblemsWithLimitedFields } from '../../problems/utils';

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
  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return {
    find() {
      return Standards.find({
        _id,
        organizationId
      });
    },
    children: [
      getDepartmentsCursorByIds,
      getStandardFiles,
      ({ _id }) => LessonsLearned.find({ documentId: _id })
    ].map(toObjFind)
     .concat(createProblemsTree(NonConformities))
  }
});

Meteor.publish('standardsDeps', function(organizationId) {
  const actionsQuery = {
    organizationId,
    type: {
      $in: [
        ActionTypes.CORRECTIVE_ACTION,
        ActionTypes.PREVENTATIVE_ACTION
      ]
    }
  };
  const standardsFields = {
    viewedBy: 1,
    createdAt: 1,
    createdBy: 1
  };

  const getProblems = getProblemsWithLimitedFields({ organizationId });

  const actions = getActionsWithLimitedFields(actionsQuery);
  const ncs = getProblems(NonConformities);
  const risks = getProblems(Risks);
  const departments = getCursorOfNonDeletedWithFields({ organizationId }, DepartmentsListProjection, Departments);
  const standards = getCursorOfNonDeletedWithFields({ organizationId }, standardsFields, Standards);

  return [
    actions,
    ncs,
    risks,
    departments,
    standards
  ];
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
