import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkCustomerRelationshipAccess,
  customerRelationshipUpdateAfterware,
} from '../../../../../share/middleware';
import { CanvasUpdateMiddlewares } from '../../../../../share/middleware/constants';

export const resolver = async (root, args, context) =>
  context.services.CustomerRelationshipService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkCustomerRelationshipAccess(),
  ...CanvasUpdateMiddlewares,
  customerRelationshipUpdateAfterware(),
)(resolver);
