import {
  loadUserById,
  loadUsersById,
  loadOrganizationById,
  loadFilesById,
  loadDepartmentsById,
  lenses,
} from 'plio-util';
import { view } from 'ramda';

import { resolveStandardsByIds } from '../util';

const {
  createdBy,
  updatedBy,
  originatorId,
  ownerId,
  deletedBy,
  notify,
  organizationId,
  fileIds,
  departmentsIds,
} = lenses;

export default {
  Risk: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    originator: loadUserById(view(originatorId)),
    owner: loadUserById(view(ownerId)),
    deletedBy: loadUserById(view(deletedBy)),
    notify: loadUsersById(view(notify)),
    organization: loadOrganizationById(view(organizationId)),
    files: loadFilesById(view(fileIds)),
    departments: loadDepartmentsById(view(departmentsIds)),
    type: ({ typeId }, args, { loaders: { RiskType: { byId } } }) => byId.load(typeId),
    standards: resolveStandardsByIds,
  },
};
