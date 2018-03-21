import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkRiskAccess,
  riskUpdateAfterware,
  ensureAnalysisCompleted,
  checkUserOrgMembership,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { RiskService }, userId }) =>
  RiskService.setAnalysisCompletedBy({ ...args, assignedBy: userId });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkRiskAccess(),
  ensureAnalysisCompleted(),
  checkUserOrgMembership({
    getUserId: (root, args) => args.executor,
  }),
  riskUpdateAfterware(),
)(resolver);
