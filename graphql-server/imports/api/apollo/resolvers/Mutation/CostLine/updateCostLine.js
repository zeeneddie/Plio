import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkCostLineAccess,
  checkPercentOfTotalCost,
  costLineUpdateAfterware,
} from '../../../../../share/middleware';
import { CanvasUpdateMiddlewares } from '../../../../../share/middleware/constants';

export const resolver = async (root, args, context) =>
  context.services.CostLineService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkCostLineAccess(),
  checkPercentOfTotalCost(),
  ...CanvasUpdateMiddlewares,
  costLineUpdateAfterware(),
)(resolver);
