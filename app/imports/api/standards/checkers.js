import { checkAndThrow } from '../helpers';
import { canChangeStandards } from '../checkers';
import { CANNOT_CHANGE_STANDARDS } from '../errors.js';

export const S_EnsureCanChange = (userId, organizationId) => {
  checkAndThrow(!canChangeStandards(userId, organizationId), CANNOT_CHANGE_STANDARDS);

  return true;
};

export const S_EnsureCanChangeChecker = ({ userId }, doc) => {
  S_EnsureCanChange(userId, doc.organizationId);

  return doc;
};
