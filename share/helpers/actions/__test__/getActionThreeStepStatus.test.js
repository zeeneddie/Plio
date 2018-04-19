import moment from 'moment-timezone';
import getActionThreeStepStatus from '../getActionThreeStepStatus';
import { ActionIndexes } from '../../../constants';

describe('getActionThreeStepStatus', () => {
  const timezone = moment.tz.guess();

  it('returns correct status if action is deleted', () => {
    const action = { isDeleted: true };
    expect(getActionThreeStepStatus(timezone, action)).toBe(ActionIndexes.DELETED);
  });

  it('returns correct status if action is completed', () => {
    const action = { isCompleted: true };
    expect(getActionThreeStepStatus(timezone, action)).toBe(ActionIndexes.COMPLETED);
  });

  it('returns default status otherwise', () => {
    expect(getActionThreeStepStatus(timezone, {})).toBe(ActionIndexes.IN_PROGRESS);
  });
});
