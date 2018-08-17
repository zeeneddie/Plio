import { GoalStatuses } from '../../share/constants';
import { StatusColors } from '../constants';

export const getStatusColor = (status) => {
  switch (status) {
    case GoalStatuses.AWAITING_COMPLETION:
      return StatusColors.AMBER;
    case GoalStatuses.OVERDUE:
      return StatusColors.RED;
    case GoalStatuses.COMPLETED:
      return StatusColors.GREEN;
    default:
      return StatusColors.DEFAULT;
  }
};
