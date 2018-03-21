import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  ensureCanChangeOrgSettings,
  departmentInsertAfterware,
} from '../../../../../share/middleware';
import Errors from '../../../../../share/errors';

export const resolver = async (root, args, { services: { DepartmentService } }) =>
  DepartmentService.insert(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  ensureCanChangeOrgSettings({
    getOrgId: (root, args) => args.organizationId,
    error: Errors.DEP_CREATE_NOT_AUTHORIZED,
  }),
  departmentInsertAfterware(),
)(resolver);
