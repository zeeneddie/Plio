import { without } from 'ramda';

import { DocumentTypes, SystemName } from '../../share/constants';
import StandardAuditConfig from '../configs/standards/standard-audit-config';
import NCAuditConfig from '../configs/non-conformities/nc-audit-config';
import RiskAuditConfig from '../configs/risks/risk-audit-config';
import GoalAuditConfig from '../configs/goals/goal-audit-config';

export const getUserId = user => ((user === SystemName) ? user : user._id);

export const getLinkedDocAuditConfig = docType => ({
  [DocumentTypes.STANDARD]: StandardAuditConfig,
  [DocumentTypes.NON_CONFORMITY]: NCAuditConfig,
  [DocumentTypes.POTENTIAL_GAIN]: NCAuditConfig,
  [DocumentTypes.RISK]: RiskAuditConfig,
  [DocumentTypes.GOAL]: GoalAuditConfig,
}[docType]);


export const getNotifyReceivers = ({ notify = [] }, user) => without(getUserId(user), notify);
