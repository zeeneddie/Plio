import { isCompleted, isVerified, noop } from 'plio-util';
import { cond, always, complement } from 'ramda';

import { ActionIndexes } from '../../constants';
import { isActionVerificationOverdue, isActionVerificationDueToday } from '../../checkers';
import getVerifiedActionStatus from './getVerifiedActionStatus';

export default (workflowType, timezone, action) => cond([
  [complement(isCompleted), noop],
  [isVerified, getVerifiedActionStatus],
  [isActionVerificationOverdue(timezone), always(ActionIndexes.VERIFY_OVERDUE)],
  [isActionVerificationDueToday(timezone), always(ActionIndexes.VERIFY_DUE_TODAY)],
])(action);
