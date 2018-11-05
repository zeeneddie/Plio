import {
  loadOrganizationById,
  loadUserById,
  lenses,
  loadUsersById,
} from 'plio-util';
import { view } from 'ramda';

const {
  createdBy,
  updatedBy,
  organizationId,
  notify,
} = lenses;

export default {
  CanvasSettings: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    organization: loadOrganizationById(view(organizationId)),
    notify: loadUsersById(view(notify)),
  },
};
