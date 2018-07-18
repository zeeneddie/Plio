import { loadOrganizationById, loadUserById, lenses } from 'plio-util';
import { view } from 'ramda';

const {
  createdBy,
  updatedBy,
  originatorId,
  organizationId,
} = lenses;

export default {
  CostLine: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    originator: loadUserById(view(originatorId)),
    organization: loadOrganizationById(view(organizationId)),
  },
};
