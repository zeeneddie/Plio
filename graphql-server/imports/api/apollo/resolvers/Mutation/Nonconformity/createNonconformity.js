import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkOrgMembership,
  flattenInput,
  checkStandardsAccess,
  insertAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.NonConformityService.insert(args, context);

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkOrgMembership((root, { organizationId, ownerId }) => ({
    organizationId,
    userId: ownerId,
  })),
  checkOrgMembership((root, { organizationId, originatorId }) => ({
    organizationId,
    userId: originatorId,
  })),
  checkStandardsAccess(),
  insertAfterware((root, args, { collections: { NonConformities } }) => ({
    collection: NonConformities,
    key: 'nonconformity',
  })),
)(resolver);
