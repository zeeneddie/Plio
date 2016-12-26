import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import curry from 'lodash.curry';
import get from 'lodash.get';

import {
  USR_CANNOT_UPDATE_ANOTHER,
  USR_CANNOT_CHANGE_ROLES,
  USR_CANNOT_CHANGE_ORG_OWNER_ROLES,
  USR_NOT_EXIST,
  USR_INCORRECT_PASSWORD,
  ACCESS_DENIED
 } from '../errors.js';
import { UserMembership } from '/imports/share/constants';
import { Organizations } from '/imports/share/collections/organizations';
import { checkAndThrow, withUserId } from '/imports/api/helpers.js';
import { canChangeRoles, isOrgOwner, isPlioAdmin, isPlioUser } from '../checkers.js';

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

export const USR_EnsurePasswordIsValid = (userId, password) => {
  if (!Meteor.isServer) {
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

export const USR_EnsureIsPlioAdmin = (userId) => {
  checkAndThrow(!isPlioAdmin(userId), ACCESS_DENIED);
};

export const USR_EnsureIsPlioUser = (userId) =>
  checkAndThrow(!isPlioUser(userId), ACCESS_DENIED);
