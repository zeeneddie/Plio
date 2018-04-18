import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';
import { curry, flip } from 'ramda';

import { Organizations } from '../../share/collections/organizations';
import {
  NOT_AN_ORG_MEMBER,
} from '../errors';
import { chain, checkAndThrow } from '../helpers';
import {
  createOrgQueryWhereUserIsOwner,
  createOrgQueryWhereUserIsMember,
} from '../../share/mongo/queries';
import { checkDocExistance } from './document';
import { isOrgOwner as isOrgOwnerChecker } from '../../share/checkers';

const userIdOrgIdTester = (userId, organizationId) => _.every([
  SimpleSchema.RegEx.Id.test(userId),
  SimpleSchema.RegEx.Id.test(organizationId),
]);

export const isOrgOwner = flip(isOrgOwnerChecker);

export const isPlioUser = (userId) => {
  const adminOrg = Organizations.findOne({ isAdminOrg: true });

  if (adminOrg === undefined) {
    return false;
  }

  return _.find(adminOrg.users, user => user.userId === userId) !== undefined;
};


export const isPlioAdmin = (userId) => {
  if (!SimpleSchema.RegEx.Id.test(userId)) {
    return false;
  }

  return !!Organizations.findOne({
    isAdminOrg: true,
    ...createOrgQueryWhereUserIsOwner(userId),
  });
};

export const isOrgMemberBySelector = (userId, selector) => !!Organizations.findOne({
  ...selector,
  ...createOrgQueryWhereUserIsMember(userId),
});

// replace all instances by shared one
export const isOrgMember = (userId, organizationId) => {
  if (!userIdOrgIdTester(userId, organizationId)) return false;

  return isOrgMemberBySelector(userId, { _id: organizationId });
};

export const checkOrgMembership = curry((userId, organizationId) =>
  checkAndThrow(!isOrgMember(userId, organizationId), NOT_AN_ORG_MEMBER));

export const checkOrgMembershipBySelector = curry((userId, selector) =>
  checkAndThrow(!isOrgMemberBySelector(userId, selector), NOT_AN_ORG_MEMBER));

export const checkOrgMembershipByDoc = (collection, query, userId) => {
  const doc = Object.assign({}, collection.findOne(query));

  checkOrgMembership(userId, doc.organizationId);

  return doc;
};

export const checkDocAndMembership = (collection, _id, userId) =>
  chain(checkDocExistance, checkOrgMembershipByDoc)(collection, _id, userId);

export const checkDocAndMembershipAndMore = (collection, _id, userId) => {
  const [doc] = checkDocAndMembership(collection, _id, userId);
  return (predicate, err) => {
    if (!err) return predicate(doc);

    checkAndThrow(predicate(doc), err);

    return doc;
  };
};
