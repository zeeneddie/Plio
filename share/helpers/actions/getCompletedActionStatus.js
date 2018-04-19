import { ActionIndexes, WorkflowTypes } from '../../constants';

export default workflowType => ({
  [WorkflowTypes.THREE_STEP]: ActionIndexes.COMPLETED,
  [WorkflowTypes.SIX_STEP]: ActionIndexes.NOT_YET_VERIFY,
})[workflowType];
