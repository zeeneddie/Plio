import { Standards } from './standards.js';
import { ImprovementPlans } from '../improvement-plans/improvement-plans.js';
import { LessonsLearned } from '../lessons/lessons.js';

Standards.after.remove((userId, { _id:documentId }) => {
  ImprovementPlans.remove({ documentId });
  LessonsLearned.remove({ documentId });
});
