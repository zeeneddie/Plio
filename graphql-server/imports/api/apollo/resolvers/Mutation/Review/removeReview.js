import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkReviewAccess,
} from '../../../../../share/middleware';

const afterware = () => async (next, root, args, context) => {
  await next(root, args, context);

  const { doc: review } = context;

  return { review };
};

export const resolver = async (root, args, { services: { ReviewService } }) =>
  ReviewService.remove(args);

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkReviewAccess(),
  afterware(),
)(resolver);
