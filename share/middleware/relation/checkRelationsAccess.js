import { applyMiddleware } from 'plio-util';

import checkDocAccess from '../document/checkDocAccess';
import { getCollectionByDocType } from '../../helpers';

export default () => async (next, root, args, context) => applyMiddleware(
  checkDocAccess((_, { rel1: { documentId, documentType } }) => ({
    query: { _id: documentId },
    collection: getCollectionByDocType(documentType),
  })),
  // Can't check second document because it's already removed at this point
)(next)(root, args, context);
