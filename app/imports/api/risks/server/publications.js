import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { getJoinUserToOrganizationDate } from '../../../api/organizations/utils';
import {
  Risks,
  Standards,
  RiskTypes,
  Departments,
  Projects,
  NonConformities,
} from '../../../share/collections';
import { isOrgMember } from '../../checkers';
import Counter from '../../counter/server';
import {
  makeOptionsFields,
  getCursorNonDeleted,
  always,
} from '../../helpers';
import { getDepartmentsCursorByIds } from '../../departments/utils';
import { getProjectsCursorByIds } from '../../projects/utils';
import { getActionsWithLimitedFields } from '../../actions/utils';
import { getProblemsWithLimitedFields } from '../../problems/utils';
import { ActionTypes } from '../../../share/constants';
import { getRiskFiles, createRiskCardPublicationTree } from '../utils';
import { getPublishCompositeOrganizationUsers } from '../../../server/helpers/pub-helpers';

const getRisksLayoutPub = (userId, serialNumber, isDeleted = false) => [
  {
    find({ _id: organizationId }) {
      return RiskTypes.find({ organizationId });
    },
  },
  {
    find({ _id: organizationId }) {
      const query = { organizationId, isDeleted };
      const options = { fields: Risks.publicFields };

      return Risks.find(query, options);
    },
    children: [
      { find: getDepartmentsCursorByIds },
      { find: getProjectsCursorByIds },
    ],
  },
];

Meteor.publishComposite('risksLayout', getPublishCompositeOrganizationUsers(getRisksLayoutPub));

Meteor.publishComposite('riskCard', function ({ _id, organizationId }) {
  check(_id, String);
  check(organizationId, String);

  const { userId } = this;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return createRiskCardPublicationTree(always({ _id, organizationId }));
});

Meteor.publish('risksDeps', function (organizationId) {
  check(organizationId, String);

  const { userId } = this;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

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
    title: 1,
    status: 1,
    organizationId: 1,
  };

  const departments = Departments.find(
    { organizationId },
    makeOptionsFields(Departments.publicFields),
  );
  const projects = Projects.find(
    { organizationId },
    makeOptionsFields(Projects.publicFields),
  );
  const actions = getActionsWithLimitedFields(actionsQuery);
  const NCs = getProblemsWithLimitedFields({ organizationId }, NonConformities);
  const standards = getCursorNonDeleted({ organizationId }, standardsFields, Standards);

  return [
    departments,
    projects,
    actions,
    NCs,
    standards,
  ];
});

Meteor.publishComposite('risksByIds', (ids = []) => {
  check(ids, [String]);

  return {
    find() {
      let query = {
        _id: { $in: ids },
        isDeleted: { $in: [null, false] },
      };

      const { userId } = this;
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
      },
    }],
  };
});

Meteor.publish('risksCount', function (counterName, organizationId) {
  check(counterName, String);
  check(organizationId, String);

  const { userId } = this;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, Risks.find({
    organizationId,
    isDeleted: false,
  }));
});

Meteor.publish('risksNotViewedCount', function (counterName, organizationId) {
  check(counterName, String);
  check(organizationId, String);

  const { userId } = this;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  const currentOrgUserJoinedAt = getJoinUserToOrganizationDate({
    organizationId, userId,
  });
  const query = {
    organizationId,
    viewedBy: { $ne: userId },
    isDeleted: false,
  };

  if (currentOrgUserJoinedAt) {
    query.createdAt = { $gt: currentOrgUserJoinedAt };
  }

  return new Counter(counterName, Risks.find(query));
});
