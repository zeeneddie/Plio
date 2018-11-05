import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkNonconformityAccess,
  branch,
  checkOrgMembership,
  checkStandardsAccess,
  checkDepartmentsAccess,
  nonconformityUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.NonConformityService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkNonconformityAccess(),
  branch(
    (root, args) => args.ownerId,
    checkOrgMembership(({ organizationId }, { ownerId }) => ({
      organizationId,
      userId: ownerId,
    })),
  ),
  branch(
    (root, args) => args.originatorId,
    checkOrgMembership(({ organizationId }, { originatorId }) => ({
      organizationId,
      userId: originatorId,
    })),
  ),
  checkStandardsAccess(),
  checkDepartmentsAccess(),
  nonconformityUpdateAfterware(),
)(resolver);
