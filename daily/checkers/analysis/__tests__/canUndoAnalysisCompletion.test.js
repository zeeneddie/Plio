import canUndoAnalysisCompletion from '../canUndoAnalysisCompletion';
import { ANALYSIS_STATUSES } from '../../../constants';

describe('canUndoAnalysisCompletion', () => {
  it('fails', () => {
    const o = {
      analysis: {
        status: ANALYSIS_STATUSES.NOT_COMPLETED,
        completedBy: 2,
      },
      updateOfStandards: {
        status: ANALYSIS_STATUSES.COMPLETED,
      },
    };

    expect(canUndoAnalysisCompletion(o, 1)).toBe(false);
  });

  it('passes', () => {
    const completedBy = 1;
    const o = {
      analysis: {
        completedBy,
        status: ANALYSIS_STATUSES.COMPLETED,
      },
      updateOfStandards: {
        status: ANALYSIS_STATUSES.NOT_COMPLETED,
      },
    };

    expect(canUndoAnalysisCompletion(o, completedBy)).toBe(true);
  });
});
