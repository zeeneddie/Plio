import { isCompleted } from 'plio-util';

import { MilestoneStatuses } from '../../constants';
import { isMilestoneOverdue } from '../../checkers';

export default (timezone, milestone) => {
  if (isCompleted(milestone)) return MilestoneStatuses.COMPLETE;

  if (isMilestoneOverdue(timezone, milestone)) return MilestoneStatuses.OVERDUE;

  return MilestoneStatuses.AWAITING_COMPLETION;
};
