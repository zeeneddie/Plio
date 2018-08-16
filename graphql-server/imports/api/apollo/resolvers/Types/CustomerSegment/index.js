import { loadOrganizationById, loadUserById, lenses } from 'plio-util';
import { view } from 'ramda';

const {
  createdBy,
  updatedBy,
  originatorId,
  organizationId,
} = lenses;

export default {
  CustomerSegment: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    originator: loadUserById(view(originatorId)),
    organization: loadOrganizationById(view(organizationId)),
    matchedTo: async (root, args, context) => {
      const { documentId } = root.matchedTo || {};
      const { loaders: { ValueProposition: { byId } } } = context;
      if (!documentId) return null;

      return byId.load(documentId);
    },
  },
};
