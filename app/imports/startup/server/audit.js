import Auditor from '/imports/core/audit/server/auditor.js';
import ActionAuditConfig from '/imports/core/audit/server/configs/action-audit-config.js';
import NCAuditConfig from '/imports/core/audit/server/configs/nc-audit-config.js';
import RiskAuditConfig from '/imports/core/audit/server/configs/risk-audit-config.js';
import StandardAuditConfig from '/imports/core/audit/server/configs/standard-audit-config.js';
import OccurenceAuditConfig from '/imports/core/audit/server/configs/occurence-audit-config.js';
import LessonAuditConfig from '/imports/core/audit/server/configs/lesson-audit-config.js';
import MessageAuditConfig from '/imports/core/audit/server/configs/message-audit-config.js';
import OrgAuditConfig from '/imports/core/audit/server/configs/org-audit-config.js';
import WorkItemAuditConfig from '/imports/core/audit/server/configs/work-item-audit-config.js';


const auditConfigs = [
  ActionAuditConfig,
  NCAuditConfig,
  RiskAuditConfig,
  StandardAuditConfig,
  OccurenceAuditConfig,
  LessonAuditConfig,
  MessageAuditConfig,
  OrgAuditConfig,
  WorkItemAuditConfig
];

_(auditConfigs).each(config => Auditor.registerConfig(config));

Auditor.startAudit();
