import {
  loadUserById,
  loadUsersById,
  loadOrganizationById,
  lenses,
  loadGoalsById,
} from 'plio-util';
import { view, compose, map } from 'ramda';

const {
  createdBy,
  updatedBy,
  notify,
  completedBy,
  organizationId,
  linkedTo,
  documentId,
} = lenses;

export default {
  Milestone: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    organization: loadOrganizationById(view(organizationId)),
    notify: loadUsersById(view(notify)),
    completedBy: loadUserById(view(completedBy)),
    goals: loadGoalsById(compose(
      map(view(documentId)),
      view(linkedTo),
    )),
  },
};
