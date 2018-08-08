import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkRiskAccess,
  riskUpdateAfterware,
  ensureAnalysisCompleted,
  checkOrgMembership,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { RiskService }, userId }) =>
  RiskService.setAnalysisCompletedBy({ ...args, assignedBy: userId });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkRiskAccess(),
  ensureAnalysisCompleted(),
  checkOrgMembership(({ organizationId }, { executor }) => ({
    organizationId,
    userId: executor,
  })),
  riskUpdateAfterware(),
)(resolver);
