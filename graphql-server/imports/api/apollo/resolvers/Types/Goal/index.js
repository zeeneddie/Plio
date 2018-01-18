import {
  loadUserById,
  loadUsersById,
  loadOrganizationById,
  loadFilesById,
  loadRisksByGoalIds,
  loadActionsByLinkedDocumentId,
  loadLessonsByDocumentId,
  lenses,
} from 'plio-util';
import { view } from 'ramda';

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
    risks: loadRisksByGoalIds(view(_id)),
    actions: loadActionsByLinkedDocumentId(view(_id)),
    lessons: loadLessonsByDocumentId(view(_id)),
  },
};
