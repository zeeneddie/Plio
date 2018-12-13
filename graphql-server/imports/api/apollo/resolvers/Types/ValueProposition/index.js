import { CanvasResolvers } from '../constants';

export default {
  ValueProposition: {
    ...CanvasResolvers,
    matchedTo: async (root, args, context) => {
      const { documentId } = root.matchedTo || {};
      const { loaders: { CustomerSegment: { byId } } } = context;
      if (!documentId) return null;

      return byId.load(documentId);
    },
    benefits: async (root, args, context) => {
      const { _id } = root;
      const { loaders: { Benefit: { byQuery } } } = context;

      return byQuery.load({ 'linkedTo.documentId': _id });
    },
    features: async (root, args, context) => {
      const { _id } = root;
      const { loaders: { Feature: { byQuery } } } = context;

      return byQuery.load({ 'linkedTo.documentId': _id });
    },
  },
};
