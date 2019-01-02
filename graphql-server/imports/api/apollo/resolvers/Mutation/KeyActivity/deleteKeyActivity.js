import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkKeyActivityAccess,
  deleteAfterware,
} from '../../../../../share/middleware';

export const resolver = async (keyActivity, args, context) =>
  context.services.KeyActivityService.delete(args, { ...context, keyActivity });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkKeyActivityAccess(),
  deleteAfterware(async (root, args, context) => ({
    collection: context.collections.KeyActivities,
  })),
)(resolver);
