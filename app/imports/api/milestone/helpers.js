import { reject, propEq } from 'ramda';
import { MilestoneStatuses } from '../../share/constants';
import { TimelineColors } from '../constants';

export const getMilestonePointColor = (status, goalColor) => {
  switch (status) {
    case MilestoneStatuses.AWAITING_COMPLETION:
      return TimelineColors.IN_PROGRESS;
    case MilestoneStatuses.OVERDUE:
      return TimelineColors.OVERDUE;
    default:
      return goalColor;
  }
};
