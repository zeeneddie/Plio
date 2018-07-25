import {
  loadUserById,
  loadUsersById,
  loadOrganizationById,
  loadFilesById,
  loadDepartmentsById,
  lenses,
} from 'plio-util';
import { view, map, flatten } from 'ramda';

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
    standards: (root, args, context) => {
      const { standardsIds = [] } = root;
      const { isDeleted = false } = args;
      const { loaders: { Standard: { byQuery } } } = context;

      return byQuery.loadMany(map(standardId => ({
        isDeleted,
        _id: standardId,
      }), standardsIds)).then(flatten);
    },
  },
};
