import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
  checkReviewAccess,
  reviewUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.ReviewService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkReviewAccess(),
  checkOrgMembership(({ organizationId }, { reviewedBy }) => ({
    organizationId,
    userId: reviewedBy,
  })),
  reviewUpdateAfterware(),
)(resolver);
