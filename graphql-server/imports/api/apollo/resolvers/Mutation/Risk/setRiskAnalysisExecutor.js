import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkRiskAccess,
  riskUpdateAfterware,
  ensureAnalysisNotCompleted,
  checkUserOrgMembership,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { RiskService }, userId }) =>
  RiskService.setAnalysisExecutor({ ...args, assignedBy: userId });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkRiskAccess(),
  ensureAnalysisNotCompleted(),
  checkUserOrgMembership({
    getUserId: (root, args) => args.executor,
  }),
  riskUpdateAfterware(),
)(resolver);
