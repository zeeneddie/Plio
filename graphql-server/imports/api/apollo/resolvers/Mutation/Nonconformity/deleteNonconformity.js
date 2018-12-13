import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkNonconformityAccess,
  deleteAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.NonConformityService.remove(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkNonconformityAccess(),
  deleteAfterware(async (root, args, context) => ({
    collection: context.collections.NonConformities,
  })),
)(resolver);
