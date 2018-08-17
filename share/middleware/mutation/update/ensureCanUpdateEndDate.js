import Errors from '../../../errors';

export default () => async (next, root, args, context) => {
  const { endDate } = args;
  const { doc } = context;
  const { startDate } = doc;

  if (new Date(endDate).getTime() <= new Date(startDate).getTime()) {
    throw new Error(Errors.END_DATE_LTE_START_DATE);
  }

  return next(root, args, context);
};
