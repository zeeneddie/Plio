import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import curry from 'lodash.curry';
import get from 'lodash.get';

import {
  USR_CANNOT_UPDATE_ANOTHER,
  USR_CANNOT_CHANGE_ROLES,
  USR_CANNOT_CHANGE_ORG_OWNER_ROLES,
  USR_NOT_EXIST,
  USR_INCORRECT_PASSWORD
 } from '../errors.js';
import { checkAndThrow, withUserId } from '/imports/api/helpers.js';
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

export const USR_CheckPassword = (userId, password) => {
  if (Meteor.isClient) {
    return false;
  }

  const user = Meteor.users.findOne({ _id: userId });
  checkAndThrow(!user, USR_NOT_EXIST);

  const hasPassword = !!get(user, 'services.password.bcrypt');
  checkAndThrow(!hasPassword, USR_INCORRECT_PASSWORD);

  const checkPasswordResult = Accounts._checkPassword(user, {
    digest: password,
    algorithm: 'sha-256'
  });

  checkAndThrow(!!checkPasswordResult.error, USR_INCORRECT_PASSWORD);
};
