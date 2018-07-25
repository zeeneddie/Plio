import { ANALYSIS_STATUSES } from '../../../constants';
import canCompleteAnalysis from '../canCompleteAnalysis';

describe('canCompleteAnalysis', () => {
  it('fails', () => {
    const userId = 1;
    const o = {
      analysis: {
        executor: 2,
        status: ANALYSIS_STATUSES.NOT_COMPLETED,
      },
    };
    expect(canCompleteAnalysis(o, userId)).toBe(false);
  });

  it('passes', () => {
    const executor = 1;
    const o = {
      analysis: {
        executor,
        status: ANALYSIS_STATUSES.NOT_COMPLETED,
      },
    };
    expect(canCompleteAnalysis(o, executor)).toBe(true);
  });
});
