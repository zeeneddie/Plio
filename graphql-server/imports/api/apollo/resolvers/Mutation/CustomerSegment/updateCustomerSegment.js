import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkCustomerSegmentAccess,
  checkPercentOfMarketSize,
  checkFilesAccess,
  customerSegmentUpdateAfterware,
  checkDocAccess,
  branch,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.CustomerSegmentService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkCustomerSegmentAccess(),
  checkPercentOfMarketSize(),
  branch(
    (root, args) => args.matchedTo,
    checkDocAccess((root, { matchedTo: { documentId } }, context) => ({
      query: { _id: documentId },
      collection: context.collections.ValuePropositions,
    })),
  ),
  checkFilesAccess(),
  customerSegmentUpdateAfterware(),
)(resolver);
