import isAnalysisCompleted from '../isAnalysisCompleted';
import { ANALYSIS_STATUSES } from '../../../constants';

describe('checkers/isAnalysisCompleted', () => {
  it('fails', () => {
    const o = { analysis: { status: ANALYSIS_STATUSES.NOT_COMPLETED } };
    expect(isAnalysisCompleted(o)).toBe(false);
  });

  it('passes', () => {
    const o = { analysis: { status: ANALYSIS_STATUSES.COMPLETED } };
    expect(isAnalysisCompleted(o)).toBe(true);
  });
});
