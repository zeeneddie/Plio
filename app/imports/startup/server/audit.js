import Auditor from '/imports/core/audit/server/auditor.js';
import ActionAuditConfig from '/imports/core/audit/server/configs/action-audit-config.js';
import NCAuditConfig from '/imports/core/audit/server/configs/nc-audit-config.js';
import RiskAuditConfig from '/imports/core/audit/server/configs/risk-audit-config.js';
import StandardAuditConfig from '/imports/core/audit/server/configs/standard-audit-config.js';
import OccurenceAuditConfig from '/imports/core/audit/server/configs/occurence-audit-config.js';
import MessageAuditConfig from '/imports/core/audit/server/configs/message-audit-config.js';


const auditConfigs = [
  ActionAuditConfig,
  NCAuditConfig,
  RiskAuditConfig,
  StandardAuditConfig,
  OccurenceAuditConfig,
  MessageAuditConfig
];

_(auditConfigs).each(config => Auditor.registerConfig(config));
