import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkRiskAccess,
  riskUpdateAfterware,
  ensureAnalysisNotCompleted,
  checkOrgMembership,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { RiskService }, userId }) =>
  RiskService.setAnalysisExecutor({ ...args, assignedBy: userId });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkRiskAccess(),
  ensureAnalysisNotCompleted(),
  checkOrgMembership(({ organizationId }, { executor }) => ({
    organizationId,
    userId: executor,
  })),
  riskUpdateAfterware(),
)(resolver);
