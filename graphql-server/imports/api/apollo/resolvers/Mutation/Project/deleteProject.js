import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkProjectAccess,
  deleteAfterware,
  ensureUserIsInRole,
} from '../../../../../share/middleware';
import { UserRoles } from '../../../../../share/constants';

export const resolver = async (root, args, context) =>
  context.services.ProjectService.delete(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkProjectAccess(),
  ensureUserIsInRole(({ organizationId }) => ({
    organizationId,
    role: UserRoles.CHANGE_ORG_SETTINGS,
  })),
  deleteAfterware(async (root, args, context) => ({
    collection: context.collections.Projects,
  })),
)(resolver);
