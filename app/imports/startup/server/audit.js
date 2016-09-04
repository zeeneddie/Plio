import Auditor from '/imports/core/audit/server/auditor.js';
import ActionAuditConfig from '/imports/core/audit/server/configs/action-audit-config';


const auditConfigs = [
  ActionAuditConfig
];

_(auditConfigs).each(config => Auditor.registerConfig(config));
