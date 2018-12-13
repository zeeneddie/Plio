import { Changelog } from '/imports/share/collections/server/changelog';
import AuditConfigs from '/imports/audit/audit-configs';
import AuditManager from '/imports/share/utils/audit-manager';
import DocChangeHandler from '/imports/audit/DocChangeHandler';
import ActionAuditConfig from '/imports/audit/configs/actions/action-audit-config';
import NCAuditConfig from '/imports/audit/configs/non-conformities/nc-audit-config';
import RiskAuditConfig from '/imports/audit/configs/risks/risk-audit-config';
import StandardAuditConfig from '/imports/audit/configs/standards/standard-audit-config';
import OccurenceAuditConfig from '/imports/audit/configs/occurrences/occurence-audit-config';
import LessonAuditConfig from '/imports/audit/configs/lessons/lesson-audit-config';
import MessageAuditConfig from '/imports/audit/configs/messages/message-audit-config';
import OrgAuditConfig from '/imports/audit/configs/organizations/org-audit-config';
import WorkItemAuditConfig from '/imports/audit/configs/work-items/work-item-audit-config';
import GoalAuditConfig from '../audit/configs/goals/goal-audit-config';
import MilestoneAuditConfig from '../audit/configs/milestones/milestone-audit-config';
import KeyPartnerAuditConfig from '../audit/configs/key-partners/key-partner-audit-config';
import KeyActivityAuditConfig from '../audit/configs/key-activities/key-activity-audit-config';
import KeyResourceAuditConfig from '../audit/configs/key-resources/key-resource-audit-config';
import ValuePropositionAuditConfig from
  '../audit/configs/value-propositions/value-proposition-audit-config';
import CustomerRelationshipAuditConfig from
  '../audit/configs/customer-relationships/customer-relationship-audit-config';
import ChannelAuditConfig from '../audit/configs/channels/channel-audit-config';
import CustomerSegmentAuditConfig from
  '../audit/configs/customer-segments/customer-segment-audit-config';
import CostLineAuditConfig from '../audit/configs/cost-lines/cost-line-audit-config';
import RevenueStreamAuditConfig from '../audit/configs/revenue-streams/revenue-stream-audit-config';
import BenefitAuditConfig from '../audit/configs/benefits/benefit-audit-config';
import FeatureAuditConfig from '../audit/configs/features/feature-audit-config';
import NeedAuditConfig from '../audit/configs/needs/need-audit-config';
import WantAuditConfig from '../audit/configs/wants/want-audit-config';
import RelationAuditConfig from '../audit/configs/relations/relation-audit-config';
import CanvasSettingsAuditConfig from
  '../audit/configs/canvas-settings/canvas-settings-audit-config';

const auditConfigs = [
  ActionAuditConfig,
  NCAuditConfig,
  RiskAuditConfig,
  StandardAuditConfig,
  OccurenceAuditConfig,
  LessonAuditConfig,
  MessageAuditConfig,
  OrgAuditConfig,
  WorkItemAuditConfig,
  GoalAuditConfig,
  MilestoneAuditConfig,
  KeyPartnerAuditConfig,
  KeyActivityAuditConfig,
  KeyResourceAuditConfig,
  ValuePropositionAuditConfig,
  CustomerRelationshipAuditConfig,
  ChannelAuditConfig,
  CustomerSegmentAuditConfig,
  CostLineAuditConfig,
  RevenueStreamAuditConfig,
  BenefitAuditConfig,
  FeatureAuditConfig,
  NeedAuditConfig,
  WantAuditConfig,
  RelationAuditConfig,
  CanvasSettingsAuditConfig,
];

auditConfigs.forEach((config) => {
  AuditConfigs.add(config);
  AuditManager.registerCollection(config.collection, config.collectionName);
});

AuditManager.startAudit();

Changelog.find().observe({
  added: ({
    _id,
    collection,
    changeKind,
    newDocument,
    oldDocument,
    userId,
  }) => {
    try {
      const auditConfig = AuditConfigs.get(collection);

      new DocChangeHandler(auditConfig, changeKind, {
        newDocument, oldDocument, userId,
      }).handleChange();
    } finally {
      Changelog.remove({ _id });
    }
  },
});
