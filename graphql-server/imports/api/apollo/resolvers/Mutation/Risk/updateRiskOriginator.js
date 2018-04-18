import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkRiskAccess,
  riskUpdateAfterware,
  checkUserOrgMembership,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { RiskService } }) =>
  RiskService.set(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkRiskAccess(),
  checkUserOrgMembership({
    getUserId: (root, args) => args.originatorId,
  }),
  riskUpdateAfterware(),
)(resolver);
