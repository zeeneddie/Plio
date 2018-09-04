import invariant from 'invariant';

import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  const { endDate } = root;
  const { startDate } = args;

  invariant(
    new Date(startDate).getTime() <= new Date(endDate).getTime(),
    Errors.START_DATE_GTE_END_DATE,
  );

  return next(root, args, context);
};
