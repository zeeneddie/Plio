import { isCompleted } from 'plio-util';
import { cond, always } from 'ramda';

import { ActionIndexes } from '../../constants';
import { isActionCompletionOverdue, isActionCompletionDueToday } from '../../checkers';
import getCompletedActionStatus from './getCompletedActionStatus';

export default (workflowType, timezone, action) => cond([
  [isCompleted, () => getCompletedActionStatus(workflowType)],
  [isActionCompletionOverdue(timezone), always(ActionIndexes.COMPLETION_OVERDUE)],
  [isActionCompletionDueToday(timezone), always(ActionIndexes.DUE_COMPLETION_TODAY)],
])(action);
