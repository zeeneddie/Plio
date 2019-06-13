import invariant from 'invariant';

import Errors from '../../errors';

export default (config = () => ({})) => async (next, root, args, context) => {
  let { startDate, endDate } = await config(root, args, context);

  if (!startDate) ({ startDate } = args);
  if (!endDate) ({ endDate } = root);

  invariant(
    new Date(startDate).getTime() <= new Date(endDate).getTime(),
    Errors.START_DATE_GTE_END_DATE,
  );

  return next(root, args, context);
};
