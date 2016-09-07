import Auditor from '/imports/core/audit/server/auditor.js';
import ActionAuditConfig from '/imports/core/audit/server/configs/action-audit-config.js';
import NCAuditConfig from '/imports/core/audit/server/configs/nc-audit-config.js';
import RiskAuditConfig from '/imports/core/audit/server/configs/risk-audit-config.js';
import OccurenceAuditConfig from '/imports/core/audit/server/configs/occurence-audit-config.js';


const auditConfigs = [
  ActionAuditConfig,
  NCAuditConfig,
  RiskAuditConfig,
  OccurenceAuditConfig
];

_(auditConfigs).each(config => Auditor.registerConfig(config));
