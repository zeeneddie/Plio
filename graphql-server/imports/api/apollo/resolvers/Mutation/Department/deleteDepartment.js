import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkDepartmentAccess,
  deleteAfterware,
  ensureUserIsInRole,
} from '../../../../../share/middleware';
import { UserRoles } from '../../../../../share/constants';

export const resolver = async (root, args, context) =>
  context.services.DepartmentService.remove(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkDepartmentAccess(),
  ensureUserIsInRole(({ organizationId }) => ({
    organizationId,
    role: UserRoles.CHANGE_ORG_SETTINGS,
  })),
  deleteAfterware(async (root, args, context) => ({
    collection: context.collections.Departments,
  })),
)(resolver);
