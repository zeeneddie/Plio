import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkRiskAccess,
  riskUpdateAfterware,
  ensureCanCompleteAnalysis,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { RiskService }, userId }) =>
  RiskService.completeAnalysis({ ...args, userId });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkRiskAccess(),
  ensureCanCompleteAnalysis(),
  riskUpdateAfterware(),
)(resolver);
