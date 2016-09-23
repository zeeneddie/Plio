import { checkAndThrow } from '/imports/share/collections/helpers.js';
import { DOC_NOT_FOUND } from '../errors.js';
import { checkDocExistance, checkOrgMembership } from '../checkers.js';
import { Occurrences } from '/imports/share/collections/occurrences.js';
import { NonConformities } from '/imports/share/collections/non-conformities.js';

export const OCC_MembershipChecker = ({ userId }, { nonConformityId }) => {
  const nc = checkDocExistance(NonConformities, nonConformityId);

  checkAndThrow(!nc, DOC_NOT_FOUND);

  checkOrgMembership(userId, nc.organizationId);

  return nc;
};
