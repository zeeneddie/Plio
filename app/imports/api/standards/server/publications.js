import { Meteor } from 'meteor/meteor';

import { getJoinUserToOrganizationDate } from '/imports/api/organizations/utils';
import { Standards } from '/imports/share/collections/standards';
import { isOrgMember } from '../../checkers';
import { Files } from '/imports/share/collections/files';
import { LessonsLearned } from '/imports/share/collections/lessons';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { Risks } from '/imports/share/collections/risks';
import { Departments } from '/imports/share/collections/departments';
import Counter from '../../counter/server';
import {
  StandardsListProjection,
  StandardsBookSectionsListProjection,
  StandardTypesListProjection,
  DepartmentsListProjection,
} from '/imports/api/constants';
import { ActionTypes } from '/imports/share/constants';
import get from 'lodash.get';
import { check } from 'meteor/check';
import { StandardsBookSections } from '/imports/share/collections/standards-book-sections';
import { StandardTypes } from '/imports/share/collections/standards-types';
import { RiskTypes } from '/imports/share/collections/risk-types.js';
import {
  makeOptionsFields,
  getCursorNonDeleted,
  toObjFind,
} from '../../helpers';
import { getDepartmentsCursorByIds } from '../../departments/utils';
import { getActionsWithLimitedFields } from '../../actions/utils';
import {
  getProblemsByStandardIds,
  createProblemsTree,
} from '../../problems/utils';
import { getPublishCompositeOrganizationUsers } from '/imports/server/helpers/pub-helpers';

const getStandardFiles = (standard) => {
  const fileIds = standard.improvementPlan && standard.improvementPlan.fileIds || [];
  const source1FileId = get(standard, 'source1.fileId');
  const source2FileId = get(standard, 'source2.fileId');
  if (source1FileId) fileIds.push(source1FileId);
  if (source2FileId) fileIds.push(source2FileId);

  return Files.find({ _id: { $in: fileIds } });
};

const getStandardsLayoutPub = function (userId, serialNumber, isDeleted) {
  const standardsFields = {
    title: 1,
    sectionId: 1,
    typeId: 1,
    organizationId: 1,
    isDeleted: 1,
    uniqueNumber: 1,
    ...(() => _.isObject(isDeleted)
      ? null
      : { deletedAt: 1, deletedBy: 1 }
    )(),
  };

  const pubs = [
    {
      find({ _id: organizationId }) {
        return StandardsBookSections.find({ organizationId }, {
          fields: StandardsBookSectionsListProjection,
        });
      },
    },
    {
      find({ _id: organizationId }) {
        return StandardTypes.find({ organizationId }, {
          fields: StandardTypesListProjection,
        });
      },
    },
    {
      find({ _id: organizationId }) {
        return Standards.find({ organizationId, isDeleted }, {
          fields: standardsFields,
        });
      },
    },
  ];

  return pubs;
};

Meteor.publishComposite(
  'standardsLayout',
  getPublishCompositeOrganizationUsers(getStandardsLayoutPub),
);

Meteor.publishComposite('standardsList', function (
  organizationId,
  isDeleted = { $in: [null, false] },
) {
  return {
    find() {
      const userId = this.userId;

      if (!userId || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      return Standards.find({
        organizationId,
        isDeleted,
      }, { fields: StandardsListProjection });
    },
  };
});

Meteor.publishComposite('standardCard', function ({ _id, organizationId }) {
  check(_id, String);
  check(organizationId, String);

  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return {
    find() {
      return Standards.find({
        _id,
        organizationId,
      });
    },
    children: [
      getDepartmentsCursorByIds,
      getStandardFiles,
      ({ _id: documentId }) => LessonsLearned.find({ documentId }),
    ].map(toObjFind)
     .concat(createProblemsTree(getProblemsByStandardIds(NonConformities)))
     .concat(createProblemsTree(getProblemsByStandardIds(Risks))),
  };
});

Meteor.publish('standardsDeps', function (organizationId) {
  const actionsQuery = {
    organizationId,
    type: {
      $in: [
        ActionTypes.CORRECTIVE_ACTION,
        ActionTypes.PREVENTATIVE_ACTION,
      ],
    },
  };
  const standardsFields = {
    status: 1,
    viewedBy: 1,
    issueNumber: 1,
    nestingLevel: 1,
    createdAt: 1,
    createdBy: 1,
  };

  const actions = getActionsWithLimitedFields(actionsQuery);
  const departments = Departments.find(
    { organizationId },
    makeOptionsFields(DepartmentsListProjection)
  );
  const standards = getCursorNonDeleted({ organizationId }, standardsFields, Standards);
  const riskTypes = RiskTypes.find({ organizationId });

  return [
    actions,
    departments,
    standards,
    riskTypes,
  ];
});

Meteor.publish('standardsCount', function (counterName, organizationId) {
  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, Standards.find({
    organizationId,
    isDeleted: { $in: [false, null] },
  }));
});

Meteor.publish('standardsNotViewedCount', function (counterName, organizationId) {
  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  const currentOrgUserJoinedAt = getJoinUserToOrganizationDate({
    organizationId, userId,
  });
  const query = {
    organizationId,
    viewedBy: { $ne: userId },
    isDeleted: { $in: [false, null] },
  };

  if (currentOrgUserJoinedAt) {
    query.createdAt = { $gt: currentOrgUserJoinedAt };
  }

  return new Counter(counterName, Standards.find(query));
});
