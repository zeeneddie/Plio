import invariant from 'invariant';

import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  const { endDate } = args;
  const { startDate } = root;

  invariant(
    new Date(endDate).getTime() >= new Date(startDate).getTime(),
    Errors.END_DATE_LTE_START_DATE,
  );

  return next(root, args, context);
};
