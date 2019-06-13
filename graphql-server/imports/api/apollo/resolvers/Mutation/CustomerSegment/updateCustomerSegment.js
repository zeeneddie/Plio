import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkCustomerSegmentAccess,
  checkPercentOfMarketSize,
  customerSegmentUpdateAfterware,
} from '../../../../../share/middleware';
import { CanvasUpdateMiddlewares } from '../../../../../share/middleware/constants';

export const resolver = async (root, args, context) =>
  context.services.CustomerSegmentService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkCustomerSegmentAccess(),
  checkPercentOfMarketSize(),
  ...CanvasUpdateMiddlewares,
  customerSegmentUpdateAfterware(),
)(resolver);
