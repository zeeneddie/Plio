import { CollectionNames } from '../constants';
import {
  Actions,
  NonConformities,
  Risks,
  Standards,
  Occurrences,
  LessonsLearned,
  Messages,
  Organizations,
  WorkItems,
  Goals,
  Milestones,
} from '../collections';
import AuditManager from '../utils/audit-manager';

const collections = {
  [CollectionNames.ACTIONS]: Actions,
  [CollectionNames.NCS]: NonConformities,
  [CollectionNames.RISKS]: Risks,
  [CollectionNames.STANDARDS]: Standards,
  [CollectionNames.OCCURRENCES]: Occurrences,
  [CollectionNames.LESSONS]: LessonsLearned,
  [CollectionNames.MESSAGES]: Messages,
  [CollectionNames.ORGANIZATIONS]: Organizations,
  [CollectionNames.WORK_ITEMS]: WorkItems,
  [CollectionNames.GOALS]: Goals,
  [CollectionNames.MILESTONES]: Milestones,
};

Object.keys(collections).forEach(name => AuditManager.registerCollection(collections[name], name));

AuditManager.startAudit();
