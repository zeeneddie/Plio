import { applyMiddleware, findByDocumentId } from 'plio-util';
import {
  checkLoggedIn,
  checkActionAccess,
  flattenInput,
  actionUpdateAfterware,
  checkDocExistance,
} from '../../../../../share/middleware';
import { getCollectionByDocType } from '../../../../../share/helpers';

export const resolver = async (root, args, { services: { ActionService } }) =>
  ActionService.unlinkDocument(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkActionAccess(),
  checkDocExistance(
    ({ documentId }) => ({ _id: documentId }),
    (root, { documentId }, { doc: { linkedTo } }) => {
      const { documentType } = Object.assign({}, findByDocumentId(documentId, linkedTo));
      return getCollectionByDocType(documentType);
    },
  ),
  actionUpdateAfterware(),
)(resolver);
