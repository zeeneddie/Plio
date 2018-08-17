import { either, defaultTo, compose, nthArg } from 'ramda';

import { ActionIndexes, WorkflowTypes } from '../../constants';
import getActionDeletionStatus from './getActionDeletionStatus';
import getActionCompletionStatus from './getActionCompletionStatus';
import getActionVerificationStatus from './getActionVerificationStatus';

// (timezone: String, action: Object) => Number
export default compose(
  defaultTo(ActionIndexes.IN_PROGRESS),
  either(
    compose(getActionDeletionStatus, nthArg(1)),
    either(
      (timezone, action) => getActionVerificationStatus(WorkflowTypes.SIX_STEP, timezone, action),
      (timezone, action) => getActionCompletionStatus(WorkflowTypes.SIX_STEP, timezone, action),
    ),
  ),
);
