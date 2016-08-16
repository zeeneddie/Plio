import { Standards } from './standards.js';
import { ImprovementPlans } from '../improvement-plans/improvement-plans.js';
import { LessonsLearned } from '../lessons/lessons.js';
import { Discussions } from '../discussions/discussions.js';
import DiscussionsService from '../discussions/discussions-service.js';
import { DocumentTypes } from '/imports/api/constants.js';

Standards.after.insert((userId, { _id, organizationId }) => {
  DiscussionsService.insert({
    organizationId,
    documentType: DocumentTypes.STANDARD,
    linkedTo: _id,
    isPrimary: true
  });
});

Standards.after.remove((userId, { _id }) => {
  ImprovementPlans.remove({ documentId: _id });
  LessonsLearned.remove({ documentId: _id });
  Discussions.remove({ linkedTo: _id });
});
