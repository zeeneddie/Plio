import { applyMiddleware, getAllStandardFileIds } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkStandardAccess,
  branch,
  checkOrgMembership,
  checkDepartmentsAccess,
  checkProjectsAccess,
  standardUpdateAfterware,
  checkStandardSectionAccess,
  checkStandardTypeAccess,
  checkFilesAccess,
  checkMultipleOrgMembership,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.StandardService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkStandardAccess(),
  branch(
    (root, args) => args.owner,
    checkOrgMembership(({ organizationId }, { owner }) => ({
      organizationId,
      userId: owner,
    })),
  ),
  branch(
    (root, args) => getAllStandardFileIds(args),
    checkFilesAccess((root, args) => ({
      fileIds: getAllStandardFileIds(args),
    })),
  ),
  branch(
    (root, args) => args.notify,
    checkMultipleOrgMembership((root, { notify }) => ({
      userIds: notify,
    })),
  ),
  branch(
    (root, args) => args.readBy,
    checkMultipleOrgMembership((root, { readBy }) => ({
      userIds: readBy,
    })),
  ),
  checkStandardSectionAccess(),
  checkStandardTypeAccess(),
  checkDepartmentsAccess(),
  checkProjectsAccess(),
  standardUpdateAfterware(),
)(resolver);
