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

export const checkAnalysis = ({ analysis = {}, updateOfStandards = {} }, args = {}) => {
  const isCompleted = ({ status = '' }) => status.toString() === _.invert(AnalysisStatuses)['Completed'];
  const findArg = _args => _find => _.keys(_args).find(key => key.includes(_find));
  const findSubstring = (str = '', ...toFind) => toFind.find(s => str.includes(s));
  const check = (predicate) => {
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
    check(analysis || analysis.executor || analysis.executor === this.userId);
  }

  if ( find('updateOfStandards') || (isAnalysis && findSubstring(isAnalysis, 'completedAt', 'completedBy')) ) {
    check(isAnalysisCompleted);
  }

  if (findSubstring(isUpdateOfStandards, 'completedAt', 'completedBy')) {
    check(isUpdateOfStandardsCompleted);
  }

  return true;
};
