import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import moment from 'moment-timezone';
import curry from 'lodash.curry';

import { UserRoles } from './constants';
import { Organizations } from './organizations/organizations.js';
import { AnalysisStatuses, UserMembership } from './constants.js';
import {
  NOT_AN_ORG_MEMBER,
  DOC_NOT_FOUND,
  ONLY_ORG_OWNER_CAN_DELETE,
  CANNOT_RESTORE_NOT_DELETED
} from './errors.js';
import { chain, checkAndThrow, injectCurry } from './helpers.js';

const { compose } = _;

export * from './actions/checkers.js';

export * from './work-items/checkers.js';

export * from './problems/checkers.js';

export * from './standards/checkers.js';

export * from './organizations/checkers.js';

export * from './occurrences/checkers.js';

export * from './users/checkers.js';

export * from './discussions/checkers.js';

export const isMobileRes = () => {
  const width = $(window).width();
  return width < 768 && width;
};

const userIdOrgIdTester = (userId, organizationId) => _.every([
  SimpleSchema.RegEx.Id.test(userId),
  SimpleSchema.RegEx.Id.test(organizationId)
]);

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

export const canChangeRoles = (userId, organizationId) => {
  return Roles.userIsInRole(
    userId,
    UserRoles.EDIT_USER_ROLES,
    organizationId
  );
}

export const isOrgOwner = (userId, organizationId) => {
  if (!userIdOrgIdTester(userId, organizationId)) return false;

  return !!Organizations.findOne({
    _id: organizationId,
    users: {
      $elemMatch: {
        userId,
        role: UserMembership.ORG_OWNER,
        isRemoved: false,
        removedBy: { $exists: false },
        removedAt: { $exists: false }
      }
    }
  });
};

export const isOrgMember = (userId, organizationId) => {
  if (!userIdOrgIdTester(userId, organizationId)) return false;

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

export const checkAnalysis = ({ analysis = {}, updateOfStandards = {}, ...rest }, args = {}) => {
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

  return { analysis, updateOfStandards, ...rest };
};

export const isViewed = (doc, userId) => {
  const { viewedBy = [] } = Object.assign({}, doc);
  return viewedBy.includes(userId);
};

export const checkOrgMembership = curry((userId, organizationId) => {
  return checkAndThrow(!isOrgMember(userId, organizationId), NOT_AN_ORG_MEMBER);
});

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

export const checkDocAndMembership = (collection, _id, userId) => {
  return chain(checkDocExistance, checkOrgMembershipByDoc)(collection, _id, userId);
};

export const checkDocAndMembershipAndMore = (collection, _id, userId) => {
  const [doc] = checkDocAndMembership(collection, _id, userId);
  return (predicate, err) => {
    if (!err) return predicate(doc);

    checkAndThrow(predicate(doc), err);

    return doc;
  };
};

export const exists = collection => fn => (...args) => {
  return compose(injectCurry(collection, checkDocExistance), fn)(...args);
};

export const wrap = curry((predicate, error) => curry((args, doc) => {
  checkAndThrow(predicate(args, doc), error);

  return doc;
}));

export const onRemoveChecker = wrap(({ userId }, doc) => {
  return doc.isDeleted && !isOrgOwner(userId, doc.organizationId);
}, ONLY_ORG_OWNER_CAN_DELETE);

export const onRestoreChecker = wrap((_, doc) => {
  return !doc.isDeleted;
}, CANNOT_RESTORE_NOT_DELETED);
