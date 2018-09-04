import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkRiskAccess,
  riskUpdateAfterware,
  checkDocAccess,
} from '../../../../../share/middleware';
import Errors from '../../../../../share/errors';

export const resolver = async (root, args, { services: { RiskService } }) =>
  RiskService.set(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkRiskAccess(),
  checkDocAccess((root, { typeId }, { collections: { RiskTypes } }) => ({
    errorMessage: Errors.LINKED_DOC_NOT_FOUND,
    collection: RiskTypes,
    query: { _id: typeId },
  })),
  riskUpdateAfterware(),
)(resolver);
