import { applyMiddleware } from 'plio-util';
import invariant from 'invariant';

import {
  checkLoggedIn,
  flattenInput,
  checkDocAccess,
} from '../../../../../share/middleware';
import { getCollectionByDocType } from '../../../../../share/helpers';

export const resolver = async (root, args, context) =>
  context.services.RelationService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkDocAccess((_, { rel1: { documentId, documentType } }) => ({
    query: { _id: documentId },
    collection: getCollectionByDocType(documentType),
  })),
  async (next, root, args, context) => next(root, args, { ...context, rel1: root }),
  checkDocAccess((_, { rel2: { documentId, documentType } }) => ({
    query: { _id: documentId },
    collection: getCollectionByDocType(documentType),
  })),
  async (next, root, args, { rel1, ...context }) => {
    const rel2 = root;
    const pred = (
      rel1.organizationId && rel2.organizationId && rel1.organizationId === rel2.organizationId
    );

    invariant(pred, 'Both documents should be of the same organization');

    return next(root, args, context);
  },
  async (next, root, args, context) => {
    const { rel1, rel2 } = args;
    const { collections: { Relations } } = context;
    const query = {
      $or: [
        {
          'rel1.documentId': rel1.documentId,
          'rel2.documentId': rel2.documentId,
        },
        {
          'rel1.documentId': rel2.documentId,
          'rel2.documentId': rel1.documentId,
        },
      ],
    };
    const relation = await Relations.findOne(query);

    invariant(!relation, 'Both documents are matched already');

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
