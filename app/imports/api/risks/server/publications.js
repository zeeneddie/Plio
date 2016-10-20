import { Meteor } from 'meteor/meteor';

import { getJoinUserToOrganizationDate } from '/imports/api/organizations/utils.js';
import { Risks } from '/imports/share/collections/risks.js';
import { Standards } from '/imports/share/collections/standards.js';
import { RiskTypes } from '/imports/share/collections/risk-types';
import { isOrgMember } from '../../checkers.js';
import { Files } from '/imports/share/collections/files.js';
import { RisksListProjection } from '/imports/api/constants.js';
import Counter from '../../counter/server.js';
import { getPublishCompositeOrganizationUsers, toObjFind } from '../../helpers';
import { getDepartmentsCursorByIds } from '../../departments/utils';
import { getStandardsCursorByIds } from '../../standards/utils';
import { getLessonsCursorByDocumentId } from '../../lessons/utils';
import { getActionsCursorByLinkedDoc } from '../../actions/utils';
import { createProblemsTree } from '../../problems/utils';

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
    children: [{
      find(risk) {
        return getRiskFiles(risk);
      }
    }]
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
