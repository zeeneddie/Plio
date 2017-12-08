import { DocumentTypes, SystemName } from '/imports/share/constants.js';
import StandardAuditConfig from '../configs/standards/standard-audit-config.js';
import NCAuditConfig from '../configs/non-conformities/nc-audit-config.js';
import RiskAuditConfig from '../configs/risks/risk-audit-config.js';


export const getUserId = user => ((user === SystemName) ? user : user._id);

export const getLinkedDocAuditConfig = docType => ({
  [DocumentTypes.STANDARD]: StandardAuditConfig,
  [DocumentTypes.NON_CONFORMITY]: NCAuditConfig,
  [DocumentTypes.RISK]: RiskAuditConfig,
}[docType]);
