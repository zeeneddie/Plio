import invariant from 'invariant';

import Errors from '../../errors';

export default (config = () => ({})) => async (next, root, args, context) => {
  let { startDate, endDate } = await config(root, args, context);

  if (!startDate) ({ startDate } = root);
  if (!endDate) ({ endDate } = args);

  invariant(
    new Date(endDate).getTime() >= new Date(startDate).getTime(),
    Errors.END_DATE_LTE_START_DATE,
  );

  return next(root, args, context);
};
