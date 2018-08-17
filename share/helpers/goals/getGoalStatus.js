import { isCompleted } from 'plio-util';

import { GoalStatuses } from '../../constants';
import { isGoalOverdue } from '../../checkers';

export default (timezone, goal) => {
  if (isCompleted(goal)) return GoalStatuses.COMPLETED;

  if (isGoalOverdue(timezone, goal)) return GoalStatuses.OVERDUE;

  return GoalStatuses.AWAITING_COMPLETION;
};
