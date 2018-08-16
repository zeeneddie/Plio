import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkActionAccess,
  flattenInput,
  actionUpdateAfterware,
  checkDocExistence,
} from '../../../../../share/middleware';
import { getCollectionByDocType } from '../../../../../share/helpers';

export const resolver = async (root, args, { services: { ActionService } }) =>
  ActionService.linkDocument(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkActionAccess(),
  checkDocExistence((root, { documentId, documentType }) => ({
    collection: getCollectionByDocType(documentType),
    query: { _id: documentId },
  })),
  actionUpdateAfterware(),
)(resolver);
