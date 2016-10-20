import { Meteor } from 'meteor/meteor';

import { getJoinUserToOrganizationDate } from '/imports/api/organizations/utils';
import { Risks } from '/imports/share/collections/risks';
import { Standards } from '/imports/share/collections/standards';
import { RiskTypes } from '/imports/share/collections/risk-types';
import { isOrgMember } from '../../checkers';
import { Files } from '/imports/share/collections/files';
import { Departments } from '/imports/share/collections/departments';
import { RisksListProjection, DepartmentsListProjection } from '/imports/api/constants';
import Counter from '../../counter/server';
import {
  getPublishCompositeOrganizationUsers,
  toObjFind,
  makeOptionsFields,
  getCursorOfNonDeletedWithFields
} from '../../helpers';
import { getDepartmentsCursorByIds } from '../../departments/utils';
import { getStandardsCursorByIds } from '../../standards/utils';
import { getLessonsCursorByDocumentId } from '../../lessons/utils';
import { getActionsCursorByLinkedDoc, getActionsWithLimitedFields } from '../../actions/utils';
import { createProblemsTree, getProblemsWithLimitedFields } from '../../problems/utils';
import { ActionTypes } from '/imports/share/constants';

const getRiskFiles = (risk) => {
  let fileIds = risk.fileIds || [];
  const IPFileIds = risk.improvementPlan && risk.improvementPlan.fileIds || [];
  fileIds = fileIds.concat(IPFileIds);

  return Files.find({ _id: { $in: fileIds } });
};

const getRisksLayoutPub = (userId, serialNumber, isDeleted) => [
  {
    find({ _id:organizationId }) {
      return RiskTypes.find({ organizationId });
    }
  },
  {
    find({ _id:organizationId }) {
      const query = { organizationId, isDeleted };
      const options = { fields: RisksListProjection };

      return Risks.find(query, options);
    },
    children: [
      {
        find: getDepartmentsCursorByIds
      }
    ]
  }
];

Meteor.publishComposite('risksLayout', getPublishCompositeOrganizationUsers(getRisksLayoutPub));

Meteor.publishComposite('risksList', function(organizationId, isDeleted = { $in: [null, false] }) {
  return {
    find() {
      const userId = this.userId;
      if (!userId || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      return Risks.find({ organizationId, isDeleted }, {
        fields: RisksListProjection
      });
    }
  }
});

Meteor.publishComposite('riskCard', function({ _id, organizationId }) {
  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  const tree = createProblemsTree(() => Risks.find({ _id, organizationId }));
  const cursorGetters = [
    getRiskFiles,
    getLessonsCursorByDocumentId,
    getStandardsCursorByIds({ title: 1 }),
  ];

  const publishTree = Object.assign({}, tree, {
    children: [
      ...tree.children,
      ...cursorGetters.map(toObjFind)
    ]
  });

  return publishTree;
});

Meteor.publish('risksDeps', function(organizationId) {
  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

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
    title: 1,
    status: 1,
    organizationId: 1
  };

  const departments = Departments.find({ organizationId }, makeOptionsFields(DepartmentsListProjection));
  const actions = getActionsWithLimitedFields(actionsQuery);
  const NCs = getProblemsWithLimitedFields({ organizationId }, NonConformities);
  const standards = getCursorOfNonDeletedWithFields({ organizationId }, standardsFields, Standards);

  return [
    departments,
    actions,
    NCs,
    standards
  ]
});

Meteor.publishComposite('risksByStandardId', function(standardId, isDeleted = { $in: [null, false] }) {
  return {
    find() {
      const userId = this.userId;
      const standard = Standards.findOne({ _id: standardId });
      const { organizationId } = !!standard && standard;

      if (!userId || !standard || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      return Risks.find({ standardId, isDeleted });
    },
    children: [
      {
        find: getRiskFiles
      }
    ]
  }
});

Meteor.publishComposite('risksByIds', function(ids = []) {
  return {
    find() {
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
    },
    children: [{
      find(risk) {
        return getRiskFiles(risk);
      }
    }]
  }
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

  return new Counter(counterName, Risks.find(query));
});
