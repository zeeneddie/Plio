import {
  loadOrganizationById,
  loadUserById,
  lenses,
  loadDepartmentsById,
} from 'plio-util';
import { view } from 'ramda';

import { resolveStandardsByIds } from '../util';

const {
  createdBy,
  updatedBy,
  originatorId,
  organizationId,
  ownerId,
  viewedBy,
  departmentsIds,
} = lenses;

export default {
  Nonconformity: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    viewedBy: loadUserById(view(viewedBy)),
    owner: loadUserById(view(ownerId)),
    originator: loadUserById(view(originatorId)),
    organization: loadOrganizationById(view(organizationId)),
    departments: loadDepartmentsById(view(departmentsIds)),
    standards: resolveStandardsByIds,
  },
};
