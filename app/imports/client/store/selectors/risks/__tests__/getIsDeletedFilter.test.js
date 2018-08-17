import getIsDeletedFilter from '../getIsDeletedFilter';
import { RiskFilterIndexes } from '../../../../../api/constants';

describe('risks getIsDeletedFilter', () => {
  it('returns true if is deleted filter', () => {
    const state = {
      global: {
        filter: RiskFilterIndexes.DELETED,
      },
    };

    expect(getIsDeletedFilter(state)).toBe(true);
  });

  it('returns false if is not deleted filter', () => {
    const state = {
      global: {
        filter: RiskFilterIndexes.TYPE,
      },
    };

    expect(getIsDeletedFilter(state)).toBe(false);
  });
});
