import { MilestoneStatuses } from '../../../share/constants';
import { TimelineColors } from '../../../api/constants';

export const getMilestoneSymbolColor = (status, color) => {
  switch (status) {
    case MilestoneStatuses.AWAITING_COMPLETION:
      return color;
    case MilestoneStatuses.DUE_TODAY:
      return TimelineColors.IN_PROGRESS;
    case MilestoneStatuses.OVERDUE:
      return TimelineColors.OVERDUE;
    case MilestoneStatuses.COMPLETED:
      return TimelineColors.COMPLETED;
    default:
      return null;
  }
};
