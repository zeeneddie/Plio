import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkOrgMembership,
} from '../../../../../share/middleware';

export const resolver = (root, args, { organization }) => organization;

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership((root, { _id, serialNumber }) => ({
    serialNumber,
    organizationId: _id,
  })),
)(resolver);
