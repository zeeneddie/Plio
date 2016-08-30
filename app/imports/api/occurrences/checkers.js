import { checkAndThrow } from '../helpers.js';
import { DOC_NOT_FOUND } from '../errors.js';
import { checkDocExistance, checkOrgMembership } from '../checkers.js';
import { Occurrences } from './occurrences.js';
import { NonConformities } from '../non-conformities/non-conformities.js';

export const OCC_MembershipChecker = ({ userId }, { nonConformityId }) => {
  const nc = checkDocExistance(NonConformities, nonConformityId);

  checkAndThrow(!nc, DOC_NOT_FOUND);

  checkOrgMembership(userId, nc.organizationId);

  return nc;
};
