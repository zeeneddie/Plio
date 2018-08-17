import {
  applyMiddleware,
  loadOrganizationById,
} from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = loadOrganizationById((root, args) => args._id);

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership((root, args) => args._id),
)(resolver);
