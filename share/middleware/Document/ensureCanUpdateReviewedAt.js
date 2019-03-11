import invariant from 'invariant';

import Errors from '../../errors';

export default (config = () => ({})) => async (next, root, args, context) => {
  let { reviewedAt } = await config(root, args, context);

  if (!reviewedAt) ({ reviewedAt } = args);

  invariant(
    new Date(reviewedAt).getTime() < new Date().getTime(),
    Errors.REVIEW_DATE_GTE_CURRENT_DATE,
  );

  return next(root, args, context);
};
