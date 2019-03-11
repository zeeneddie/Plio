import { loadOrganizationById, loadUserById, lenses } from 'plio-util';
import { view } from 'ramda';

const {
  createdBy,
  updatedBy,
  reviewedBy,
  organizationId,
} = lenses;

export default {
  Review: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    reviewedBy: loadUserById(view(reviewedBy)),
    organization: loadOrganizationById(view(organizationId)),
    isViewed: (root, args, { userId }) =>
      root.reviewedBy === userId || root.viewedBy.includes(userId),
  },
};
