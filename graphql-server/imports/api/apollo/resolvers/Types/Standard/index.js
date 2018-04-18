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
  owner,
  deletedBy,
  notify,
  organizationId,
  fileIds,
} = lenses;

export default {
  Standard: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    owner: loadUserById(view(owner)),
    deletedBy: loadUserById(view(deletedBy)),
    notify: loadUsersById(view(notify)),
    organization: loadOrganizationById(view(organizationId)),
    files: loadFilesById(view(fileIds)),
  },
};
