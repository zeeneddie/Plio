import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkRiskAccess,
  riskUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { RiskService } }) =>
  RiskService.remove(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkRiskAccess(),
  riskUpdateAfterware(),
)(resolver);
