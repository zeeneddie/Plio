import {
  loadUserById,
  loadUsersById,
  loadOrganizationById,
  loadFilesById,
  loadActionsByLinkedDocumentId,
  loadLessonsByDocumentId,
  loadMilestonesById,
  loadRisksById,
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
  riskIds,
  milestoneIds,
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
    milestones: loadMilestonesById(view(milestoneIds)),
  },
};
