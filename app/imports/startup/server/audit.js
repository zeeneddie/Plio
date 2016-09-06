import Auditor from '/imports/core/audit/server/auditor.js';
import ActionAuditConfig from '/imports/core/audit/server/configs/action-audit-config';
import NCAuditConfig from '/imports/core/audit/server/configs/nc-audit-config';


const auditConfigs = [
  ActionAuditConfig,
  NCAuditConfig
];

_(auditConfigs).each(config => Auditor.registerConfig(config));
