import {
  loadUserById,
  loadUsersById,
  loadOrganizationById,
  loadFilesById,
  lenses,
} from 'plio-util';
import { view } from 'ramda';

const {
  createdBy,
  updatedBy,
  originatorId,
  ownerId,
  deletedBy,
  notify,
  organizationId,
  fileIds,
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
  },
};
