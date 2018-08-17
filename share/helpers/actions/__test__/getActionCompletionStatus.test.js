import moment from 'moment-timezone';
import getActionCompletionStatus from '../getActionCompletionStatus';
import { ActionIndexes, WorkflowTypes } from '../../../constants';

describe('getActionCompletionStatus', () => {
  const timezone = moment.tz.guess();

  it('returns correct status if action is completed', () => {
    const action = {
      isCompleted: true,
    };
    const threeStepStatus = getActionCompletionStatus(WorkflowTypes.THREE_STEP, timezone, action);
    const sixStepStatus = getActionCompletionStatus(WorkflowTypes.SIX_STEP, timezone, action);

    expect(threeStepStatus).toBe(ActionIndexes.COMPLETED);
    expect(sixStepStatus).toBe(ActionIndexes.NOT_YET_VERIFY);
  });

  it('returns correct status if action is overdue', () => {
    const action = {
      isCompleted: false,
      completionTargetDate: moment().subtract(2, 'days'),
    };

    [WorkflowTypes.THREE_STEP, WorkflowTypes.SIX_STEP].forEach((workflowType) => {
      const status = getActionCompletionStatus(workflowType, timezone, action);
      expect(status).toBe(ActionIndexes.COMPLETION_OVERDUE);
    });
  });

  it('returns correct status if action is due today', () => {
    const action = {
      isCompleted: false,
      completionTargetDate: new Date(),
    };

    [WorkflowTypes.THREE_STEP, WorkflowTypes.SIX_STEP].forEach((workflowType) => {
      const status = getActionCompletionStatus(workflowType, timezone, action);
      expect(status).toBe(ActionIndexes.DUE_COMPLETION_TODAY);
    });
  });
});
