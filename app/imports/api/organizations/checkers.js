import { CANNOT_CHANGE_ORG_SETTINGS } from '../errors.js';
import { canChangeOrgSettings } from '../checkers.js';
import { checkAndThrow } from '../helpers.js';

export const O_EnsureCanChange = (userId, organizationId) => {
  checkAndThrow(!canChangeOrgSettings(userId, organizationId), CANNOT_CHANGE_ORG_SETTINGS);

  return true;
};

export const O_EnsureCanChangeChecker = ({ userId }, doc) => {
  O_EnsureCanChange(userId, doc.organizationId);

  return doc;
};
