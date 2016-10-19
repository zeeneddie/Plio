import { Meteor } from 'meteor/meteor';

import { getJoinUserToOrganizationDate } from '/imports/api/organizations/utils.js';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { Standards } from '/imports/share/collections/standards';
import { Files } from '/imports/share/collections/files';
import { LessonsLearned } from '/imports/share/collections/lessons';
import { Actions } from '/imports/share/collections/actions';
import { Occurrences } from '/imports/share/collections/occurrences';
import { Departments } from '/imports/share/collections/departments';
import { isOrgMember } from '../../checkers.js';
import {
  NonConformitiesListProjection,
  DepartmentsListProjection
} from '/imports/api/constants.js';
import { ActionTypes } from '/imports/share/constants';
import Counter from '../../counter/server.js';
import {
  getPublishCompositeOrganizationUsers,
  getCursorOfNonDeletedWithFields,
  toObjFind,
  makeOptionsFields
} from '../../helpers';
import get from 'lodash.get';
import { getDepartmentsCursorByIds } from '../../departments/utils';
import {
  getActionsCursorByLinkedDoc,
  getActionsWithLimitedFields
} from '../../actions/utils';
import { getStandardCursorByIds } from '../../standards/utils';
import { getProblemsWithLimitedFields } from '../../problems/utils';


const getNCOtherFiles = (nc) => {
  let fileIds = nc.fileIds || [];
  const improvementPlanFileIds = get(nc, 'improvementPlan.fileIds');
  if (!!improvementPlanFileIds) {
    fileIds = fileIds.concat(improvementPlanFileIds);
  }
  const rcaFileIds = get(nc, 'rootCauseAnalysis.fileIds');
  if (!!rcaFileIds) {
    fileIds = fileIds.concat(rcaFileIds);
  }

  return Files.find({ _id: { $in: fileIds } });
};

const getNCLayoutPub = (userId, serialNumber, isDeleted) => {
  return [
    {
      find({ _id:organizationId }) {
        const query = { organizationId, isDeleted };
        const options = { fields: NonConformitiesListProjection };
        return NonConformities.find(query, options);
      },
      children: [
        {
          find: getDepartmentsCursorByIds
        }
      ]
    }
  ]
};

Meteor.publishComposite('nonConformitiesLayout', getPublishCompositeOrganizationUsers(getNCLayoutPub));

Meteor.publishComposite('nonConformitiesList', function (organizationId, isDeleted = { $in: [null, false] }) {
  return {
    find() {
      const userId = this.userId;
      if (!userId || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      return NonConformities.find({ organizationId, isDeleted }, {
        fields: NonConformitiesListProjection
      });
    }
  }
});

Meteor.publishComposite('nonConformityCard', function({ _id, organizationId }) {
  const userId = this.userId;

  if (!userId || !isOrgMember(userId, organizationId)) {
    return this.ready();
  }

  return {
    ...toObjFind(() => NonConformities.find({ _id, organizationId })),
    children: [
      getDepartmentsCursorByIds,
      getNCOtherFiles,
      getStandardCursorByIds({ title: 1 }),
      ({ _id: documentId }) => LessonsLearned.find({ documentId }),
      getActionsCursorByLinkedDoc({}),
      ({ _id: nonConformityId }) => Occurrences.find({ nonConformityId }),
    ].map(toObjFind)
  };
});

Meteor.publish('nonConformitiesDeps', function(organizationId) {
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
  }

  const departments = Departments.find({ organizationId }, makeOptionsFields(DepartmentsListProjection));
  const occurrences = Occurrences.find({ organizationId });
  const actions = getActionsWithLimitedFields(actionsQuery);
  const risks = getProblemsWithLimitedFields({ organizationId }, Risks);
  const standards = getCursorOfNonDeletedWithFields({ organizationId }, standardsFields, Standards);

  return [
    departments,
    occurrences,
    actions,
    risks,
    standards
  ];
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
      find: getNCOtherFiles
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
      find: getNCOtherFiles
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

  if (currentOrgUserJoinedAt){
    query.createdAt = { $gt: currentOrgUserJoinedAt };
  }

  return new Counter(counterName, NonConformities.find(query));
});
