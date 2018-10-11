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
  KeyPartners,
  KeyActivities,
  KeyResources,
  ValuePropositions,
  CustomerRelationships,
  Channels,
  CustomerSegments,
  CostLines,
  RevenueStreams,
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
  [CollectionNames.KEY_PARTNERS]: KeyPartners,
  [CollectionNames.KEY_ACTIVITIES]: KeyActivities,
  [CollectionNames.KEY_RESOURCES]: KeyResources,
  [CollectionNames.VALUE_PROPOSITIONS]: ValuePropositions,
  [CollectionNames.CUSTOMER_RELATIONSHIPS]: CustomerRelationships,
  [CollectionNames.CHANNELS]: Channels,
  [CollectionNames.CUSTOMER_SEGMENTS]: CustomerSegments,
  [CollectionNames.COST_LINES]: CostLines,
  [CollectionNames.REVENUE_STREAMS]: RevenueStreams,
};

Object.keys(collections).forEach(name => AuditManager.registerCollection(collections[name], name));

AuditManager.startAudit();
