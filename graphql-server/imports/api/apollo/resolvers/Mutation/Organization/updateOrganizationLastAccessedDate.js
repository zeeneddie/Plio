import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
} from '../../../../../share/middleware';

export const resolver = async (root, { _id }, { services: { OrganizationService } }) =>
  OrganizationService.set({ _id, lastAccessedDate: new Date() });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership((root, { _id }) => ({ organizationId: _id })),
)(resolver);
