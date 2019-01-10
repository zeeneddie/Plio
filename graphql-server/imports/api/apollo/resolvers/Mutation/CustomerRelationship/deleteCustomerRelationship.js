import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkCustomerRelationshipAccess,
  deleteAfterware,
} from '../../../../../share/middleware';

export const resolver = async (customerRelationship, args, context) =>
  context.services.CustomerRelationshipService.delete(args, { ...context, customerRelationship });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkCustomerRelationshipAccess(),
  deleteAfterware(async (root, args, context) => ({
    collection: context.collections.CustomerRelationships,
  })),
)(resolver);
