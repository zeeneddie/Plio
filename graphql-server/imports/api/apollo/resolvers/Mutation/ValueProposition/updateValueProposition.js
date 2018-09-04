import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkValuePropositionAccess,
  valuePropositionUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.ValuePropositionService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkValuePropositionAccess(),
  valuePropositionUpdateAfterware(),
)(resolver);
