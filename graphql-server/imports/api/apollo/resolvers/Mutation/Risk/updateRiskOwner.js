import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkRiskAccess,
  riskUpdateAfterware,
  checkOrgMembership,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { RiskService } }) =>
  RiskService.set(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkRiskAccess(),
  checkOrgMembership(({ organizationId }, { ownerId }) => ({
    organizationId,
    userId: ownerId,
  })),
  riskUpdateAfterware(),
)(resolver);
