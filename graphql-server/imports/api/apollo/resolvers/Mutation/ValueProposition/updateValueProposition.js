import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkValuePropositionAccess,
  valuePropositionUpdateAfterware,
  checkValuePropositionMatchedToAccess,
} from '../../../../../share/middleware';
import { CanvasUpdateMiddlewares } from '../../../../../share/middleware/constants';

export const resolver = async (root, args, context) =>
  context.services.ValuePropositionService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkValuePropositionAccess(),
  checkValuePropositionMatchedToAccess(),
  ...CanvasUpdateMiddlewares,
  valuePropositionUpdateAfterware(),
)(resolver);
