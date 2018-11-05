import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
  canvasSettingsUpdateAfterware,
  ensureUserIsInRole,
} from '../../../../../share/middleware';
import { UserRoles } from '../../../../../share/constants';

export const resolver = async (root, args, context) =>
  context.services.CanvasSettingsService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  ensureUserIsInRole((root, { organizationId }) => ({
    organizationId,
    role: UserRoles.CHANGE_ORG_SETTINGS,
  })),
  // TODO: check notify users access
  canvasSettingsUpdateAfterware(),
)(resolver);
