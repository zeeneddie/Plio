import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { getJoinUserToOrganizationDate } from '/imports/api/organizations/utils';
import {
  NonConformities,
  Standards,
  Occurrences,
  Departments,
  Risks,
} from '../../../share/collections';
import { isOrgMember } from '../../checkers';
import { ActionTypes } from '../../../share/constants';
import Counter from '../../counter/server';
import {
  getCursorNonDeleted,
  makeOptionsFields,
} from '../../helpers';
import { getPublishCompositeOrganizationUsers } from '../../../server/helpers/pub-helpers';
import { getDepartmentsCursorByIds } from '../../departments/utils';
import { getProjectsCursorByIds } from '../../projects/utils';
import { getActionsWithLimitedFields } from '../../actions/utils';
import { getProblemsWithLimitedFields } from '../../problems/utils';
import {
  createNonConformityCardPublicationTree,
  getNCOtherFiles,
} from '../../non-conformities/utils';

const getNCLayoutPub = (userId, serialNumber, isDeleted = false) => [
  {
    find({ _id: organizationId }) {
      const query = { organizationId, isDeleted };
      const options = { fields: NonConformities.publicFields };
      return NonConformities.find(query, options);
    },
    children: [
      { find: getDepartmentsCursorByIds },
      { find: getProjectsCursorByIds },
    ],
  },
];

Meteor.publishComposite(
  'nonConformitiesLayout',
  getPublishCompositeOrganizationUsers(getNCLayoutPub),
);

Meteor.publishComposite('nonConformityCard', function ({ _id, organizationId }) {
  check(_id, String);
  check(organizationId, String);

  const { userId } = this;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return createNonConformityCardPublicationTree(() => ({ _id, organizationId }));
});

Meteor.publish('nonConformitiesDeps', function (organizationId) {
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
        ActionTypes.GENERAL_ACTION,
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
  const occurrences = Occurrences.find({ organizationId });
  const actions = getActionsWithLimitedFields(actionsQuery);
  const risks = getProblemsWithLimitedFields({ organizationId }, Risks);
  const standards = getCursorNonDeleted({ organizationId }, standardsFields, Standards);

  return [
    departments,
    occurrences,
    actions,
    risks,
    standards,
  ];
});

Meteor.publishComposite('nonConformitiesByIds', (ids = []) => {
  check(ids, [String]);

  return {
    find() {
      let query = {
        _id: { $in: ids },
        isDeleted: { $in: [null, false] },
      };

      const { userId } = this;
      const { organizationId } = Object.assign({}, NonConformities.findOne(query));

      if (!userId || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      query = { ...query, organizationId };

      return NonConformities.find(query);
    },
    children: [{
      find: getNCOtherFiles,
    }],
  };
});

Meteor.publish('nonConformitiesCount', function (counterName, organizationId) {
  check(counterName, String);
  check(organizationId, String);

  const { userId } = this;
  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return new Counter(counterName, NonConformities.find({
    organizationId,
    isDeleted: { $in: [false, null] },
  }));
});

Meteor.publish('nonConformitiesNotViewedCount', function (counterName, organizationId) {
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
    isDeleted: { $in: [false, null] },
  };

  if (currentOrgUserJoinedAt) {
    query.createdAt = { $gt: currentOrgUserJoinedAt };
  }

  return new Counter(counterName, NonConformities.find(query));
});
