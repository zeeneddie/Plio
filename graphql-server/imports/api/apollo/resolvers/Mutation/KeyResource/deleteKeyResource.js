import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkKeyResourceAccess,
  deleteAfterware,
} from '../../../../../share/middleware';

export const resolver = async (keyResource, args, context) =>
  context.services.KeyResourceService.delete(args, { ...context, keyResource });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkKeyResourceAccess(),
  deleteAfterware(async (root, args, context) => ({
    collection: context.collections.KeyResources,
  })),
)(resolver);
