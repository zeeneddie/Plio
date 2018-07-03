import { MilestoneStatuses } from '../../../share/constants';
import { MilestoneStatusColors } from '../../../api/constants';

export const getMilestoneSymbolColor = (status, color) => {
  switch (status) {
    case MilestoneStatuses.AWAITING_COMPLETION:
      return color;
    case MilestoneStatuses.DUE_TODAY:
      return MilestoneStatusColors.IN_PROGRESS;
    case MilestoneStatuses.OVERDUE:
      return MilestoneStatusColors.OVERDUE;
    case MilestoneStatuses.COMPLETED:
      return MilestoneStatusColors.COMPLETED;
    default:
      return null;
  }
};
