import {
  loadUserById,
  loadUsersById,
  loadOrganizationById,
  loadFilesById,
  loadActionsByLinkedDocumentId,
  loadLessonsByDocumentId,
  loadRisksById,
  lenses,
} from 'plio-util';
import { view, map, flatten } from 'ramda';

const {
  _id,
  createdBy,
  updatedBy,
  ownerId,
  deletedBy,
  notify,
  organizationId,
  completedBy,
  fileIds,
  riskIds,
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
    risks: loadRisksById(view(riskIds)),
    actions: loadActionsByLinkedDocumentId(view(_id)),
    lessons: loadLessonsByDocumentId(view(_id)),
    milestones: async ({ milestoneIds }, args, { loaders: { Milestone: { byQuery } } }) =>
      byQuery.loadMany(map(milestoneId => ({
        _id: milestoneId,
        isDeleted: false,
      }), milestoneIds)).then(flatten),
  },
};
