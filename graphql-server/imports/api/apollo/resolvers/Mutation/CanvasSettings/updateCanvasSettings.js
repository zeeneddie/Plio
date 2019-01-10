import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
  canvasSettingsUpdateAfterware,
  ensureUserIsInRole,
  checkMultipleOrgMembership,
  branch,
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
  branch(
    (root, args) => args.notify,
    checkMultipleOrgMembership((root, { notify }) => ({
      userIds: notify,
    })),
  ),
  canvasSettingsUpdateAfterware(),
)(resolver);
