import { applyMiddleware } from 'plio-util';
import checkDocExistanceById from './checkDocExistanceById';
import checkOrgMembership from '../auth/checkOrgMembership';

export default (
  collection,
  getOrgId = (root, args, context) => context.doc.organizationId,
) => async (next, root, args, context) => applyMiddleware(
  checkDocExistanceById(collection),
  checkOrgMembership(getOrgId),
)(next)(root, args, context);
