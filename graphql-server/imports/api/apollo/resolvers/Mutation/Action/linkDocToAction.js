import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkActionAccess,
  flattenInput,
  actionUpdateAfterware,
  checkDocExistance,
} from '../../../../../share/middleware';
import { getCollectionByDocType } from '../../../../../share/helpers';

export const resolver = async (root, args, { services: { ActionService } }) =>
  ActionService.linkDocument(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkActionAccess(),
  checkDocExistance(
    ({ documentId }) => ({ _id: documentId }),
    (root, { documentType }) => getCollectionByDocType(documentType),
  ),
  actionUpdateAfterware(),
)(resolver);
