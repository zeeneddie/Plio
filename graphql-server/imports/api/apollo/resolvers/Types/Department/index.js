import {
  loadUserById,
  loadOrganizationById,
  lenses,
} from 'plio-util';
import { view } from 'ramda';

const {
  createdBy,
  updatedBy,
  organizationId,
  name,
} = lenses;

export default {
  Department: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    organization: loadOrganizationById(view(organizationId)),
    title: view(name),
  },
};
