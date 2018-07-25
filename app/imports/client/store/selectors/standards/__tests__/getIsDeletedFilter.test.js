import getIsDeletedFilter from '../getIsDeletedFilter';
import { STANDARD_FILTER_MAP } from '../../../../../api/constants';

describe('standards getIsDeletedFilter', () => {
  it('returns true if is deleted filter', () => {
    const state = {
      global: {
        filter: STANDARD_FILTER_MAP.DELETED,
      },
    };

    expect(getIsDeletedFilter(state)).toBe(true);
  });

  it('returns false if is not deleted filter', () => {
    const state = {
      global: {
        filter: STANDARD_FILTER_MAP.SECTION,
      },
    };

    expect(getIsDeletedFilter(state)).toBe(false);
  });
});
