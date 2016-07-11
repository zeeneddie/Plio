import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { UserRoles } from './constants';
import { Organizations } from './organizations/organizations.js';
import { AnalysisStatuses } from './constants.js';


export const canChangeStandards = (userId, organizationId) => {
  return Roles.userIsInRole(
    userId,
    UserRoles.CREATE_UPDATE_DELETE_STANDARDS,
    organizationId
  );
};

export const canChangeOrgSettings = (userId, organizationId) => {
  return Roles.userIsInRole(
    userId,
    UserRoles.CHANGE_ORG_SETTINGS,
    organizationId
  );
};

export const canInviteUsers = (userId, organizationId) => {
  return Roles.userIsInRole(
    userId,
    UserRoles.INVITE_USERS,
    organizationId
  );
};

export const canDeleteUsers = (userId, organizationId) => {
  return Roles.userIsInRole(
    userId,
    UserRoles.DELETE_USERS,
    organizationId
  );
};

export const isOrgMember = (userId, organizationId) => {
  const areArgsValid = _.every([
    SimpleSchema.RegEx.Id.test(userId),
    SimpleSchema.RegEx.Id.test(organizationId)
  ]);

  if (!areArgsValid) {
    return false;
  }

  return !!Organizations.find({
    _id: organizationId,
    users: {
      $elemMatch: {
        userId,
        isRemoved: false,
        removedBy: { $exists: false },
        removedAt: { $exists: false }
      }
    }
  });
};

export const checkAnalysis = (doc = {}, args = {}) => {
  const has = (obj, ...args) => args.some(a => obj.hasOwnProperty(a));

  const isCompleted = prop => prop && prop.status && prop.status.toString() === _.invert(AnalysisStatuses)['Completed'];

  const isAnalysisCompleted = isCompleted(doc.analysis);
  const isUpdateOfStandardsCompleted = isCompleted(doc.updateOfStandards);

  if (has(args, 'analysis.status', 'updateOfStandards.status')) {
    if (!doc.analysis.executor && doc.analysis.executor !== this.userId) {
      throw new Meteor.Error(
        403, 'Access denied'
      );
    }
  }

  if (_.keys(args).find(key => key.includes('updateOfStandards'))) {
    if (!isAnalysisCompleted) {
      throw new Meteor.Error(
        403, 'Access denied'
      );
    }

    if (has(args, 'updateOfStandards.completedAt', 'updateOfStandards.completedBy')) {
      if (!isUpdateOfStandardsCompleted) {
        throw new Meteor.Error(
          403, 'Access denied'
        );
      }
    }
  }

  if (has(args, 'analysis.completedAt', 'analysis.completedBy')) {
    if (!isAnalysisCompleted) {
      throw new Meteor.Error(
        403, 'Access denied'
      );
    }
  }
};
