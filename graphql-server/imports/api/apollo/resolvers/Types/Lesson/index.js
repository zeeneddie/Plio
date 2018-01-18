import { loadOrganizationById, loadUserById, lenses } from 'plio-util';
import { view } from 'ramda';

const {
  createdBy,
  updatedBy,
  owner,
  organizationId,
} = lenses;

export default {
  Lesson: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    owner: loadUserById(view(owner)),
    organization: loadOrganizationById(view(organizationId)),
  },
};
