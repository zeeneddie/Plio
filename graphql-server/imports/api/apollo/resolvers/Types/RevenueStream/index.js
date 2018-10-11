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
  originatorId,
  organizationId,
  notify,
} = lenses;

export default {
  RevenueStream: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    originator: loadUserById(view(originatorId)),
    organization: loadOrganizationById(view(organizationId)),
    notify: loadUsersById(view(notify)),
  },
};
