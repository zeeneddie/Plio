import { either, defaultTo, compose, nthArg } from 'ramda';

import { ActionIndexes, WorkflowTypes } from '../../constants';
import getActionDeletionStatus from './getActionDeletionStatus';
import getActionCompletionStatus from './getActionCompletionStatus';

// (timezone: String, action: Object) => Number
export default compose(
  defaultTo(ActionIndexes.IN_PROGRESS),
  either(
    compose(getActionDeletionStatus, nthArg(1)),
    (timezone, action) => getActionCompletionStatus(WorkflowTypes.THREE_STEP, timezone, action),
  ),
);
