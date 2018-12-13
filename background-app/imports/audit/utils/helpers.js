import { without } from 'ramda';

import { DocumentTypes, SystemName } from '../../share/constants';
import { getCollectionByDocType } from '../../share/helpers';
import StandardAuditConfig from '../configs/standards/standard-audit-config';
import NCAuditConfig from '../configs/non-conformities/nc-audit-config';
import RiskAuditConfig from '../configs/risks/risk-audit-config';
import GoalAuditConfig from '../configs/goals/goal-audit-config';
import KeyPartnerAuditConfig from '../configs/key-partners/key-partner-audit-config';
import KeyActivityAuditConfig from '../configs/key-activities/key-activity-audit-config';
import KeyResourceAuditConfig from '../configs/key-resources/key-resource-audit-config';
import ValuePropositionAuditConfig from
  '../configs/value-propositions/value-proposition-audit-config';
import CustomerRelationshipAuditConfig from
  '../configs/customer-relationships/customer-relationship-audit-config';
import ChannelAuditConfig from '../configs/channels/channel-audit-config';
import CostLineAuditConfig from '../configs/cost-lines/cost-line-audit-config';
import RevenueStreamAuditConfig from '../configs/revenue-streams/revenue-stream-audit-config';
import CustomerSegmentAuditConfig from
  '../configs/customer-segments/customer-segment-audit-config';
import BenefitAuditConfig from '../configs/benefits/benefit-audit-config';
import FeatureAuditConfig from '../configs/features/feature-audit-config';
import NeedAuditConfig from '../configs/needs/need-audit-config';
import WantAuditConfig from '../configs/wants/want-audit-config';

export const getUserId = user => ((user === SystemName) ? user : user._id);

export const getLinkedDocAuditConfig = docType => ({
  [DocumentTypes.STANDARD]: StandardAuditConfig,
  [DocumentTypes.NON_CONFORMITY]: NCAuditConfig,
  [DocumentTypes.POTENTIAL_GAIN]: NCAuditConfig,
  [DocumentTypes.RISK]: RiskAuditConfig,
  [DocumentTypes.GOAL]: GoalAuditConfig,
  [DocumentTypes.KEY_PARTNER]: KeyPartnerAuditConfig,
  [DocumentTypes.KEY_ACTIVITY]: KeyActivityAuditConfig,
  [DocumentTypes.KEY_RESOURCE]: KeyResourceAuditConfig,
  [DocumentTypes.VALUE_PROPOSITION]: ValuePropositionAuditConfig,
  [DocumentTypes.CUSTOMER_RELATIONSHIP]: CustomerRelationshipAuditConfig,
  [DocumentTypes.CHANNEL]: ChannelAuditConfig,
  [DocumentTypes.CUSTOMER_SEGMENT]: CustomerSegmentAuditConfig,
  [DocumentTypes.COST_LINE]: CostLineAuditConfig,
  [DocumentTypes.REVENUE_STREAM]: RevenueStreamAuditConfig,
  [DocumentTypes.BENEFIT]: BenefitAuditConfig,
  [DocumentTypes.FEATURE]: FeatureAuditConfig,
  [DocumentTypes.NEED]: NeedAuditConfig,
  [DocumentTypes.WANT]: WantAuditConfig,
}[docType]);

export const getLinkedDoc = (documentId, documentType) => {
  const collection = getCollectionByDocType(documentType);
  return collection.findOne({ _id: documentId });
};

export const getLinkedDocDescription = (documentId, documentType) => {
  const doc = getLinkedDoc(documentId, documentType);
  const docAuditConfig = getLinkedDocAuditConfig(documentType);

  return docAuditConfig.docDescription(doc);
};

export const getLinkedDocName = (documentId, documentType) => {
  const doc = getLinkedDoc(documentId, documentType);
  const docAuditConfig = getLinkedDocAuditConfig(documentType);

  return docAuditConfig.docName(doc);
};

export const getNotifyReceivers = ({ notify = [] }, user) => without(getUserId(user), notify);
