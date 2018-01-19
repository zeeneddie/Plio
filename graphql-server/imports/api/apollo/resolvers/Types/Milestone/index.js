import {
  loadUserById,
  loadUsersById,
  loadOrganizationById,
  lenses,
} from 'plio-util';
import { view } from 'ramda';

const {
  createdBy,
  updatedBy,
  notify,
  completedBy,
  organizationId,
} = lenses;

export default {
  Milestone: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    organization: loadOrganizationById(view(organizationId)),
    notify: loadUsersById(view(notify)),
    completedBy: loadUserById(view(completedBy)),
  },
};
