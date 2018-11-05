import { applyMiddleware, getAllStandardFileIds } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkStandardAccess,
  branch,
  checkOrgMembership,
  checkDepartmentsAccess,
  standardUpdateAfterware,
  checkStandardSectionAccess,
  checkStandardTypeAccess,
  checkFilesAccess,
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
  checkStandardSectionAccess(),
  checkStandardTypeAccess(),
  checkDepartmentsAccess(),
  standardUpdateAfterware(),
)(resolver);
