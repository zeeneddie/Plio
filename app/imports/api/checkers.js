import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import moment from 'moment-timezone';

import { UserRoles } from './constants';
import { Organizations } from './organizations/organizations.js';
import { AnalysisStatuses, OrgOwnerRoles } from './constants.js';
import { NOT_AN_ORG_MEMBER, DOC_NOT_FOUND } from './errors.js';
import { checkAndThrow } from './helpers.js';


export * from './actions/checkers.js';

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

export const isOrgOwner = (userId, organizationId) => {
  return Roles.userIsInRole(
    userId,
    OrgOwnerRoles,
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

const checkTargetDate = (targetDate, timezone) => {
  if (!targetDate) {
    return false;
  }

  timezone = timezone || moment.tz.guess();

  const tzNow = moment(new Date()).tz(timezone);
  const tzTargetDate = moment(targetDate).tz(timezone);

  if (tzNow.isAfter(tzTargetDate, 'day')) {
    return 1;
  } else if (tzNow.isSame(tzTargetDate, 'day')) {
    return 0;
  } else if (tzNow.isBefore(tzTargetDate, 'day')) {
    return -1;
  }
};

export const isDueToday = (targetDate, timezone) => {
  return checkTargetDate(targetDate, timezone) === 0;
};

export const isOverdue = (targetDate, timezone) => {
  return checkTargetDate(targetDate, timezone) === 1;
};

export const checkAnalysis = ({ analysis = {}, updateOfStandards = {} }, args = {}) => {
  const isCompleted = ({ status = '' }) => status.toString() === _.invert(AnalysisStatuses)['Completed'];
  const findArg = _args => _find => _.keys(_args).find(key => key.includes(_find));
  const findSubstring = (str = '', ...toFind) => toFind.find(s => str.includes(s));
  const checkAnalysisAndThrow = (predicate) => {
    if (!predicate) {
      throw new Meteor.Error(403, 'Access denied');
    }
  };

  const isAnalysisCompleted = isCompleted(analysis);
  const isUpdateOfStandardsCompleted = isCompleted(updateOfStandards);

  const find = findArg(args);

  const isAnalysis = find('analysis');
  const isUpdateOfStandards = find('updateOfStandards');

  if (find('analysis.status') || find('updateOfStandards.status')) {
    checkAnalysisAndThrow(analysis || analysis.executor || analysis.executor === this.userId);
  }

  if ( find('updateOfStandards') || (isAnalysis && findSubstring(isAnalysis, 'completedAt', 'completedBy')) ) {
    checkAnalysisAndThrow(isAnalysisCompleted);
  }

  if (findSubstring(isUpdateOfStandards, 'completedAt', 'completedBy')) {
    checkAnalysisAndThrow(isUpdateOfStandardsCompleted);
  }

  return true;
};

export const isViewed = (doc, userId) => {
  const { viewedBy = [] } = Object.assign({}, doc);
  return !!viewedBy.length && viewedBy.includes(userId);
};

export const checkOrgMembership = (userId, organizationId) => {
  return checkAndThrow(!isOrgMember(userId, organizationId), NOT_AN_ORG_MEMBER);
};

export const checkOrgMembershipByDoc = (collection, query, userId) => {
  const doc = Object.assign({}, collection.findOne(query));

  checkOrgMembership(userId, doc.organizationId);

  return doc;
};

export const checkDocExistance = (collection, query) => {
  const doc = collection.findOne(query);

  checkAndThrow(!doc, DOC_NOT_FOUND);

  return doc;
};
