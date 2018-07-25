import { checkAndThrow } from '../helpers';
import { DOC_NOT_FOUND } from '../errors.js';
import { checkDocExistance, checkOrgMembership } from '../checkers';
import { NonConformities } from '../../share/collections/non-conformities';

export const OCC_MembershipChecker = ({ userId }, { nonConformityId }) => {
  const nc = checkDocExistance(NonConformities, nonConformityId);

  checkAndThrow(!nc, DOC_NOT_FOUND);

  checkOrgMembership(userId, nc.organizationId);

  return nc;
};
