import moment from 'moment';

import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  const { completionTargetDate } = args;
  const { goal: { startDate, endDate } } = context;

  if (moment(completionTargetDate).isBefore(startDate)) {
    throw new Error(Errors.COMPLETION_TARGET_DATE_BEFORE_START_DATE);
  }

  if (moment(completionTargetDate).isAfter(endDate)) {
    throw new Error(Errors.COMPLETION_TARGET_DATE_AFTER_END_DATE);
  }

  return next(root, args, context);
};
