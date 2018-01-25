import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';
import { curry } from 'ramda';

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

const userIdOrgIdTester = (userId, organizationId) => _.every([
  SimpleSchema.RegEx.Id.test(userId),
  SimpleSchema.RegEx.Id.test(organizationId),
]);

export const isOrgOwner = (userId, organizationId) => {
  if (!userIdOrgIdTester(userId, organizationId)) return false;

  const query = {
    _id: organizationId,
    ...createOrgQueryWhereUserIsOwner(userId),
  };

  return !!Organizations.findOne(query);
};

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
