import {
  loadUserById,
  loadUsersById,
  loadOrganizationById,
  loadFilesById,
  loadActionsByLinkedDocumentId,
  loadLessonsByDocumentId,
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
    actions: loadActionsByLinkedDocumentId(view(_id)),
    lessons: loadLessonsByDocumentId(view(_id)),
    milestones: async (root, args, context) => {
      const { milestoneIds } = root;
      const { loaders: { Milestone: { byQuery } } } = context;

      return byQuery.loadMany(map(milestoneId => ({
        _id: milestoneId,
        isDeleted: false,
      }), milestoneIds)).then(flatten);
    },
    risks: async (root, args, context) => {
      const { riskIds } = root;
      const { isDeleted = false } = args;
      const { loaders: { Risk: { byQuery } } } = context;

      return byQuery.loadMany(map(riskId => ({
        _id: riskId,
        isDeleted,
      }), riskIds)).then(flatten);
    },
  },
};
