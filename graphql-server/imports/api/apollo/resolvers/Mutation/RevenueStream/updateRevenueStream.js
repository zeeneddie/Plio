import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkRevenueStreamAccess,
  checkPercentOfRevenue,
  checkPercentOfProfit,
  revenueStreamUpdateAfterware,
} from '../../../../../share/middleware';
import { CanvasUpdateMiddlewares } from '../../../../../share/middleware/constants';

export const resolver = async (root, args, context) =>
  context.services.RevenueStreamService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkRevenueStreamAccess(),
  checkPercentOfRevenue(),
  checkPercentOfProfit(),
  ...CanvasUpdateMiddlewares,
  revenueStreamUpdateAfterware(),
)(resolver);
