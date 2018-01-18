import {
  loadUserById,
  loadUsersById,
  loadOrganizationById,
  loadFilesById,
  loadRisksByGoalIds,
  lenses,
} from 'plio-util';
import { view } from 'ramda';

const {
  _id: idLens,
  createdBy,
  updatedBy,
  ownerId,
  deletedBy,
  notify,
  organizationId,
  completedBy,
  fileIds,
} = lenses;

export default {
  Goal: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    deletedBy: loadUserById(view(deletedBy)),
    completedBy: loadUserById(view(completedBy)),
    owner: loadUserById(view(ownerId)),
    notify: loadUsersById(view(notify)),
    organization: loadOrganizationById(view(organizationId)),
    files: loadFilesById(view(fileIds)),
    risks: loadRisksByGoalIds(view(idLens)),
    actions: async ({ _id }, _, { collections: { Actions } }) =>
      Actions.find({ 'linkedTo.documentId': _id }).fetch(),
    lessons: async ({ _id }, _, { collections: { LessonsLearned } }) =>
      LessonsLearned.find({ 'linkedTo.documentId': _id }).fetch(),
  },
};
