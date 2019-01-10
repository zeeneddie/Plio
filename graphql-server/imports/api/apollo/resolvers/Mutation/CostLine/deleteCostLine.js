import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkCostLineAccess,
  deleteAfterware,
} from '../../../../../share/middleware';

export const resolver = async (costLine, args, context) =>
  context.services.CostLineService.delete(args, { ...context, costLine });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkCostLineAccess(),
  deleteAfterware(async (root, args, context) => ({
    collection: context.collections.CostLines,
  })),
)(resolver);
