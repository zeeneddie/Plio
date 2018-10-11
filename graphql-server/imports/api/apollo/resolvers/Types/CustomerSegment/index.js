import {
  loadOrganizationById,
  loadUserById,
  loadUsersById,
  lenses,
} from 'plio-util';
import { view } from 'ramda';

const {
  createdBy,
  updatedBy,
  originatorId,
  organizationId,
  notify,
} = lenses;

export default {
  CustomerSegment: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    originator: loadUserById(view(originatorId)),
    organization: loadOrganizationById(view(organizationId)),
    notify: loadUsersById(view(notify)),
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
