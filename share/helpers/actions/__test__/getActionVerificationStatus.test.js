import moment from 'moment-timezone';
import getActionVerificationStatus from '../getActionVerificationStatus';
import { ActionIndexes, WorkflowTypes } from '../../../constants';

describe('getActionVerificationStatus', () => {
  const timezone = moment.tz.guess();

  it('returns undefined if action is not completed', () => {
    const action = { isCompleted: false };
    expect(getActionVerificationStatus(WorkflowTypes.THREE_STEP, timezone, action)).toBe(undefined);
  });

  it('returns correct status if action is verified as effective', () => {
    const action = {
      isCompleted: true,
      isVerified: true,
      isVerifiedAsEffective: true,
    };

    [WorkflowTypes.THREE_STEP, WorkflowTypes.SIX_STEP].forEach((workflowType) => {
      const status = getActionVerificationStatus(workflowType, timezone, action);
      expect(status).toBe(ActionIndexes.COMPLETED_EFFECTIVE);
    });
  });

  it('returns correct status if action failed verification', () => {
    const action = {
      isCompleted: true,
      isVerified: true,
      isVerifiedAsEffective: false,
    };

    [WorkflowTypes.THREE_STEP, WorkflowTypes.SIX_STEP].forEach((workflowType) => {
      const status = getActionVerificationStatus(workflowType, timezone, action);
      expect(status).toBe(ActionIndexes.COMPLETED_FAILED);
    });
  });

  it('returns correct status if action is overdue', () => {
    const action = {
      isCompleted: true,
      isVerified: false,
      verificationTargetDate: moment().subtract(2, 'days'),
    };

    [WorkflowTypes.THREE_STEP, WorkflowTypes.SIX_STEP].forEach((workflowType) => {
      const status = getActionVerificationStatus(workflowType, timezone, action);
      expect(status).toBe(ActionIndexes.VERIFY_OVERDUE);
    });
  });

  it('returns correct status if action is due today', () => {
    const action = {
      isCompleted: true,
      isVerified: false,
      verificationTargetDate: new Date(),
    };

    [WorkflowTypes.THREE_STEP, WorkflowTypes.SIX_STEP].forEach((workflowType) => {
      const status = getActionVerificationStatus(workflowType, timezone, action);
      expect(status).toBe(ActionIndexes.VERIFY_DUE_TODAY);
    });
  });
});
