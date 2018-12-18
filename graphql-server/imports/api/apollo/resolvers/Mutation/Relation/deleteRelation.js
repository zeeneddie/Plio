import { applyMiddleware } from 'plio-util';

import {
  checkLoggedIn,
  flattenInput,
  checkRelationsAccess,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.RelationService.delete(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkRelationsAccess(),
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
