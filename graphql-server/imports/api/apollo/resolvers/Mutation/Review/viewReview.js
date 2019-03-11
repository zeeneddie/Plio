import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkReviewAccess,
  reviewUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, { _id }, { userId, services: { ReviewService } }) =>
  ReviewService.updateViewedBy({ _id, viewedBy: userId });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkReviewAccess(),
  reviewUpdateAfterware(),
)(resolver);
