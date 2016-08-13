import { Standards } from './standards.js';
import { ImprovementPlans } from '../improvement-plans/improvement-plans.js';
import { LessonsLearned } from '../lessons/lessons.js';
import DiscussionsService from '../discussions/discussions-service.js';
import { DocumentTypes } from '/imports/api/constants.js';


Standards.after.insert((userId, { _id, organizationId }) => {
  DiscussionsService.insert({
    organizationId,
    documentType: DocumentTypes[0],
    linkedTo: _id,
    isPrimary: true
  });
});

Standards.after.remove((userId, { _id: documentId }) => {
  ImprovementPlans.remove({ documentId });
  LessonsLearned.remove({ documentId });
});
