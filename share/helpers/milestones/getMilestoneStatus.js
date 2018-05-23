import { isCompleted } from 'plio-util';

import { MilestoneStatuses } from '../../constants';
import { isMilestoneOverdue, isMilestoneDueToday } from '../../checkers';

export default (timezone, milestone) => {
  if (isCompleted(milestone)) return MilestoneStatuses.COMPLETED;

  if (isMilestoneDueToday(timezone, milestone)) return MilestoneStatuses.DUE_TODAY;

  if (isMilestoneOverdue(timezone, milestone)) return MilestoneStatuses.OVERDUE;

  return MilestoneStatuses.AWAITING_COMPLETION;
};
