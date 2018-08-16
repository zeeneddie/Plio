import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkRiskAccess,
  checkDocsAccess,
  riskUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { RiskService } }) =>
  RiskService.set(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkRiskAccess(),
  checkDocsAccess((root, { departmentsIds }, { collections: { Departments } }) => ({
    ids: departmentsIds,
    collection: Departments,
  })),
  riskUpdateAfterware(),
)(resolver);
