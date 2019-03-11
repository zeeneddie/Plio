import { applyMiddleware } from 'plio-util';

import {
  checkLoggedIn,
  checkOrgMembership,
  flattenInput,
  checkDocExistence,
  ensureCanUpdateReviewedAt,
} from '../../../../../share/middleware';
import { getCollectionByDocType } from '../../../../../share/helpers';

const afterware = () => async (next, root, args, context) => {
  const { collections: { Reviews } } = context;
  const _id = await next(root, args, context);
  const review = Reviews.findOne({ _id });
  return { review };
};

export const resolver = async (root, args, context) =>
  context.services.ReviewService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership((root, { organizationId, reviewedBy }) => ({
    organizationId,
    userId: reviewedBy,
  })),
  checkDocExistence((root, { documentId, documentType }) => ({
    query: { _id: documentId },
    collection: getCollectionByDocType(documentType),
  })),
  ensureCanUpdateReviewedAt(),
  afterware(),
)(resolver);
