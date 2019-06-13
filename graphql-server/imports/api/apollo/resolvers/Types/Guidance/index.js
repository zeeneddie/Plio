import { loadUserById, lenses } from 'plio-util';
import { view } from 'ramda';
import sanitizeHtml from 'sanitize-html';

const { createdBy, updatedBy } = lenses;

export default {
  Guidance: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    html: async ({ html }) => sanitizeHtml(html),
    subguidances: async ({ documentType }, args, { loaders: { Guidance: { byQuery } } }) =>
      byQuery.load({
        documentType,
        title: { $exists: true },
      }),
  },
};
