import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkOrgMembership,
  flattenInput,
  insertAfterware,
  branch,
  checkStandardSectionAccess,
  checkStandardTypeAccess,
  checkDocAccess,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { StandardService } }) =>
  StandardService.insert(args);

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  branch(
    (root, args) => args.owner,
    checkOrgMembership((root, { organizationId, owner }) => ({
      organizationId,
      userId: owner,
    })),
  ),
  branch(
    (root, args) => args.source1 && args.source1.fileId,
    checkDocAccess((root, { source1 }, context) => ({
      query: { _id: source1.fileId },
      collection: context.collections.Files,
    })),
  ),
  checkStandardSectionAccess(),
  checkStandardTypeAccess(),
  insertAfterware((root, args, { collections: { Standards } }) => ({
    collection: Standards,
    key: 'standard',
  })),
)(resolver);
