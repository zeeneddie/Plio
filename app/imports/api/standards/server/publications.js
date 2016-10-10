import { Meteor } from 'meteor/meteor';

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
import Counter from '../../counter/server.js';
import { StandardsListProjection } from '/imports/api/constants.js';
import get from 'lodash.get';
import property from 'lodash.property';
import { check, Match } from 'meteor/check';
import { StandardsBookSections } from '../../standards-book-sections/standards-book-sections';
import { StandardTypes } from '../../standards-types/standards-types';

const getStandardFiles = (standard) => {
  const fileIds = standard.improvementPlan && standard.improvementPlan.fileIds || [];
  const source1FileId = get(standard, 'source1.fileId');
  const source2FileId = get(standard, 'source2.fileId');
  source1FileId && fileIds.push(source1FileId);
  source2FileId && fileIds.push(source2FileId);

  return Files.find({ _id: { $in: fileIds } });
};

Meteor.publishComposite('standardsLayout', function(serialNumber, isDeleted = { $in: [null, false] }) {
  check(serialNumber, Number);
  check(isDeleted, Match.OneOf(Boolean, {
    $in: Array
  }));

  const userId = this.userId;

  if (!userId || !isOrgMemberBySelector(userId, { serialNumber })) {
    return this.ready();
  }

  return {
    find() {
      return getUserOrganizations(userId, { serialNumber });
    },
    children: [
      {
        find({ users = [] }) {
          const userIds = users.map(property('userId'));

          return Meteor.users.find({ _id: { $in: userIds } });
        }
      },
      {
        find({ _id:organizationId }) {
          return StandardsBookSections.find({ organizationId });
        }
      },
      {
        find({ _id:organizationId }) {
          return StandardTypes.find({ organizationId });
        }
      },
      {
        find({ _id:organizationId }) {
          return Standards.find({ organizationId, isDeleted });
        }
      }
    ]
  };
});

Meteor.publishComposite('standardsList', function(organizationId, isDeleted = { $in: [null, false] }) {
  return {
    find() {
      const userId = this.userId;
      if (!userId || !isOrgMember(userId, organizationId)) {
        return this.ready();
      }

      return Standards.find({
        organizationId,
        isDeleted: isDeleted
      }, { fields: StandardsListProjection });
    }
  }
});

Meteor.publishComposite('standardCard', function({ _id, organizationId }) {
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
    children: [{
      find(standard) {
        return getStandardFiles(standard);
      }
    }, {
      find({ _id }) {
        return LessonsLearned.find({ documentId: _id });
      }
    }, {
      find({ _id }) {
        return NonConformities.find({ standardsIds: _id });
      },
      children: [{
        find(nc) {
          return Actions.find({ 'linkedTo.documentId': nc._id });
        },
      }, {
        find(nc) {
          return WorkItems.find({ 'linkedDoc._id': nc._id });
        }
      }]
    }, {
      find({ _id }) {
        return Risks.find({ standardsIds: _id });
      },
      children: [{
        find(risk) {
          return Actions.find({ 'linkedTo.documentId': risk._id });
        },
      }, {
        find(risk) {
          return WorkItems.find({ 'linkedDoc._id': risk._id });
        }
      }]
    }]
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

  if(currentOrgUserJoinedAt){
    query.createdAt = { $gt: currentOrgUserJoinedAt };
  }

  return new Counter(counterName, Standards.find(query));
});
