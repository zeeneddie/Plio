import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkRiskAccess,
  riskUpdateAfterware,
  ensureAnalysisCompleted,
  ensureIsAnalysisOwner,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { RiskService } }) =>
  RiskService.setAnalysisComments(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkRiskAccess(),
  ensureAnalysisCompleted(),
  ensureIsAnalysisOwner(),
  riskUpdateAfterware(),
)(resolver);
