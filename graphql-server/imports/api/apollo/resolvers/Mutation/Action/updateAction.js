import { applyMiddleware } from 'plio-util';
import {
  branch,
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
  checkActionAccess,
  actionUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.ActionService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkActionAccess(),
  checkOrgMembership(({ organizationId }, { ownerId }) => ({
    organizationId,
    userId: ownerId,
  })),
  checkOrgMembership(({ organizationId }, { toBeCompletedBy }) => ({
    organizationId,
    userId: toBeCompletedBy,
  })),
  branch(
    (root, args) => args.completedBy,
    checkOrgMembership(({ organizationId }, { completedBy }) => ({
      organizationId,
      userId: completedBy,
    })),
  ),
  branch(
    (root, args) => args.toBeVerifiedBy,
    checkOrgMembership(({ organizationId }, { toBeVerifiedBy }) => ({
      organizationId,
      userId: toBeVerifiedBy,
    })),
  ),
  branch(
    (root, args) => args.verifiedBy,
    checkOrgMembership(({ organizationId }, { verifiedBy }) => ({
      organizationId,
      userId: verifiedBy,
    })),
  ),
  actionUpdateAfterware(),
)(resolver);
