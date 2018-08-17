import { ANALYSIS_STATUSES } from '../../../constants';
import isUpdateOfStandardsCompleted from '../isUpdateOfStandardsCompleted';

describe('isUpdateOfStandardsCompleted', () => {
  it('fails', () => {
    const o = { updateOfStandards: { status: ANALYSIS_STATUSES.NOT_COMPLETED } };
    expect(isUpdateOfStandardsCompleted(o)).toBe(false);
  });

  it('passes', () => {
    const o = { updateOfStandards: { status: ANALYSIS_STATUSES.COMPLETED } };
    expect(isUpdateOfStandardsCompleted(o)).toBe(true);
  });
});
