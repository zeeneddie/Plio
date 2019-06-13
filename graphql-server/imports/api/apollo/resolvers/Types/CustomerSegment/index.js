import { CanvasResolvers } from '../constants';

export default {
  CustomerSegment: {
    ...CanvasResolvers,
    matchedTo: async (root, args, context) => {
      const { documentId } = root.matchedTo || {};
      const { loaders: { ValueProposition: { byId } } } = context;
      if (!documentId) return null;

      return byId.load(documentId);
    },
    needs: async (root, args, context) => {
      const { _id } = root;
      const { loaders: { Need: { byQuery } } } = context;

      return byQuery.load({ 'linkedTo.documentId': _id });
    },
    wants: async (root, args, context) => {
      const { _id } = root;
      const { loaders: { Want: { byQuery } } } = context;

      return byQuery.load({ 'linkedTo.documentId': _id });
    },
  },
};
