import getFilteredStandards from '../getFilteredStandards';
import { STANDARD_FILTER_MAP } from '../../../../../api/constants';

describe('getFilteredStandards', () => {
  const existing = { isDeleted: false };
  const deleted = { isDeleted: true };
  const standards = [existing, deleted];

  it('should filter deleted standards', () => {
    const state = {
      collections: { standards },
      global: {
        filter: STANDARD_FILTER_MAP.DELETED,
      },
    };

    expect(getFilteredStandards(state)).toEqual([deleted]);
  });

  it('should filter existing standards', () => {
    const state = {
      collections: { standards },
      global: {
        filter: STANDARD_FILTER_MAP.SECTION,
      },
    };

    expect(getFilteredStandards(state)).toEqual([existing]);
  });
});
