import { compose, ifElse, equals, curry } from 'ramda';

import { WorkflowTypes } from '../../constants';
import getActionThreeStepStatus from './getActionThreeStepStatus';
import getActionSixStepStatus from './getActionSixStepStatus';
import getActionWorkflowType from './getActionWorkflowType';

export default curry((timezone, action) => compose(
  ifElse(
    equals(WorkflowTypes.SIX_STEP),
    () => getActionSixStepStatus(timezone, action),
    () => getActionThreeStepStatus(timezone, action),
  ),
  getActionWorkflowType,
)(action));
