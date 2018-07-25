import getFilteredStandards from '../getFilteredStandards';
import { STANDARD_FILTER_MAP } from '../../../../../api/constants';
import { getInitialState } from '../../../util/tests';

describe('getFilteredStandards', () => {
  const existing = { isDeleted: false };
  const deleted = { isDeleted: true };
  const standards = [existing, deleted];

  it('should filter deleted standards', () => {
    const state = getInitialState({
      collections: { standards },
      global: {
        filter: STANDARD_FILTER_MAP.DELETED,
      },
    });

    expect(getFilteredStandards(state)).toEqual([deleted]);
  });

  it('should filter existing standards', () => {
    const state = getInitialState({
      collections: { standards },
    });

    expect(getFilteredStandards(state)).toEqual([existing]);
  });
});
