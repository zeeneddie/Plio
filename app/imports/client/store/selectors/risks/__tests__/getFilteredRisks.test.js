import getFilteredRisks from '../getFilteredRisks';
import { RiskFilterIndexes } from '../../../../../api/constants';
import { getInitialState } from '../../../util/tests';

describe('getFilteredRisks', () => {
  const existing = { isDeleted: false };
  const deleted = { isDeleted: true };
  const risks = [existing, deleted];

  it('filters deleted risks', () => {
    const state = getInitialState({
      collections: { risks },
      global: {
        filter: RiskFilterIndexes.DELETED,
      },
    });

    expect(getFilteredRisks(state)).toEqual([deleted]);
  });

  it('filters existing risks', () => {
    const state = getInitialState({
      collections: { risks },
    });

    expect(getFilteredRisks(state)).toEqual([existing]);
  });
});
