import curry from 'lodash.curry';

import {
  USR_CANNOT_UPDATE_ANOTHER,
  USR_CANNOT_CHANGE_ROLES,
  USR_CANNOT_CHANGE_ORG_OWNER_ROLES
 } from '../errors.js';
import { checkAndThrow, withUserId } from '../helpers.js';
import { canChangeRoles, isOrgOwner } from '../checkers.js';

export const USR_EnsureUpdatingHimselfChecker = curry(({ userId }, doc) => {
  const predicate = Object.is(userId, doc._id);

  checkAndThrow(!predicate, USR_CANNOT_UPDATE_ANOTHER);

  return doc;
});

export const USR_EnsureCanChangeRolesChecker = curry(({ userId }, doc) => {
  const predicate = canChangeRoles(userId, doc.organizationId);

  checkAndThrow(!predicate, USR_CANNOT_CHANGE_ROLES);

  return doc;
});

export const USR_EnsureIsNotOrgOwnerChecker = (doc) => {
  const predicate = isOrgOwner(doc._id, doc.organizationId);

  checkAndThrow(predicate, USR_CANNOT_CHANGE_ORG_OWNER_ROLES);

  return doc;
};
