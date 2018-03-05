import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  ensureIsOrgOwner,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { OrganizationService } }) =>
  OrganizationService.updateWorkspaceDefaults(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  ensureIsOrgOwner(),
)(resolver);
