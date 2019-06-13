import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkProjectAccess,
  projectUpdateAfterware,
  ensureUserIsInRole,
} from '../../../../../share/middleware';
import { UserRoles } from '../../../../../share/constants';

export const resolver = async (root, args, context) =>
  context.services.ProjectService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkProjectAccess(),
  ensureUserIsInRole(({ organizationId }) => ({
    organizationId,
    role: UserRoles.CHANGE_ORG_SETTINGS,
  })),
  projectUpdateAfterware(),
)(resolver);
