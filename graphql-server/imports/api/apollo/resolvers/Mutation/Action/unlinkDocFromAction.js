import { applyMiddleware, findByDocumentId } from 'plio-util';
import { compose, prop } from 'ramda';

import {
  checkLoggedIn,
  checkActionAccess,
  flattenInput,
  actionUpdateAfterware,
  checkDocExistence,
} from '../../../../../share/middleware';
import { getCollectionByDocType } from '../../../../../share/helpers';

const getCollection = compose(
  getCollectionByDocType,
  prop('documentType'),
  findByDocumentId,
);

export const resolver = async (root, args, { services: { ActionService } }) =>
  ActionService.unlinkDocument(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkActionAccess(),
  checkDocExistence(({ linkedTo }, { documentId }) => ({
    query: { _id: documentId },
    collection: getCollection(documentId, linkedTo),
  })),
  actionUpdateAfterware(),
)(resolver);
