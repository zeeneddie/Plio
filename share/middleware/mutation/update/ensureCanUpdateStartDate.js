import Errors from '../../../errors';

export default () => async (next, root, args, context) => {
  const { startDate } = args;
  const { doc } = context;
  const { endDate } = doc;

  if (new Date(startDate).getTime() >= new Date(endDate).getTime()) {
    throw new Error(Errors.START_DATE_GTE_END_DATE);
  }

  return next(root, args, context);
};
