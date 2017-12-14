import { compose, curry } from 'ramda';

import {
  DOC_NOT_FOUND,
  ONLY_ORG_OWNER_CAN_DELETE,
  CANNOT_RESTORE_NOT_DELETED,
} from '../errors';
import { checkAndThrow, injectCurry, getUserJoinedAt } from '../helpers';
import { isOrgOwner } from './membership';

export const isViewed = (doc, userId) => {
  const { viewedBy = [] } = Object.assign({}, doc);

  return viewedBy.includes(userId);
};

export const checkDocExistance = (collection, query) => {
  const doc = collection.findOne(query);

  checkAndThrow(!doc, DOC_NOT_FOUND);

  return doc;
};

export const exists = collection => fn => (...args) =>
  compose(injectCurry(collection, checkDocExistance), fn)(...args);

export const wrap = curry((predicate, error) => curry((args, doc) => {
  checkAndThrow(predicate(args, doc), error);

  return doc;
}));

export const onRemoveChecker = wrap(({ userId }, doc) =>
  doc.isDeleted && !isOrgOwner(userId, doc.organizationId), ONLY_ORG_OWNER_CAN_DELETE);

export const onRestoreChecker = wrap((__, doc) => !doc.isDeleted, CANNOT_RESTORE_NOT_DELETED);

export const isNewDoc = (organization, userId, { createdAt, viewedBy = [] }) => {
  if (!organization || !userId || !(viewedBy instanceof Array)) return false;

  const joinedAt = getUserJoinedAt(organization, userId);

  if (!joinedAt) return false;

  return !viewedBy.includes(userId) && createdAt > joinedAt;
};
