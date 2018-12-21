import { applyMiddleware, noop } from 'plio-util';

import {
  checkLoggedIn,
  flattenInput,
  checkDocAccess,
} from '../../../../../share/middleware';
import { getCollectionByDocType } from '../../../../../share/helpers';
import Errors from '../../../../../share/errors';

export const resolver = async (root, args, context) =>
  context.services.RelationService.delete(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  // check one of document's access since the other one could be already deleted at this point
  async (next, root, args, context) => {
    try {
      await checkDocAccess((_, { rel1: { documentId, documentType } }) => ({
        query: { _id: documentId },
        collection: getCollectionByDocType(documentType),
      }))(noop, root, args, context);
    } catch (err) {
      if (err.message !== Errors.NOT_FOUND) throw err;

      await checkDocAccess((_, { rel2: { documentId, documentType } }) => ({
        query: { _id: documentId },
        collection: getCollectionByDocType(documentType),
      }))(noop, root, args, context);
    }

    return next(root, args, context);
  },
  async (next, root, args, context) => {
    await next(root, args, context);

    const { rel1, rel2 } = args;
    return {
      rel1: {
        documentType: rel1.documentType,
      },
      rel2: {
        documentType: rel2.documentType,
      },
    };
  },
)(resolver);
