import moment from 'moment-timezone';
import getActionSixStepStatus from '../getActionSixStepStatus';
import { ActionIndexes } from '../../../constants';

describe('getActionSixStepStatus', () => {
  const timezone = moment.tz.guess();

  it('returns correct status if action is deleted', () => {
    const action = { isDeleted: true };
    expect(getActionSixStepStatus(timezone, action)).toBe(ActionIndexes.DELETED);
  });

  it('returns correct status if action is verified', () => {
    const action = { isCompleted: true, isVerified: true, isVerifiedAsEffective: true };
    expect(getActionSixStepStatus(timezone, action)).toBe(ActionIndexes.COMPLETED_EFFECTIVE);
  });

  it('returns correct status if action is completed', () => {
    const action = { isCompleted: true };
    expect(getActionSixStepStatus(timezone, action)).toBe(ActionIndexes.NOT_YET_VERIFY);
  });

  it('returns default status otherwise', () => {
    expect(getActionSixStepStatus(timezone, {})).toBe(ActionIndexes.IN_PROGRESS);
  });
});
