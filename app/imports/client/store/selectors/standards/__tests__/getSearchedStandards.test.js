import getSearchedStandards from '../getSearchedStandards';
import { STANDARD_FILTER_MAP } from '../../../../../api/constants';

describe('getSearchedStandards', () => {
  it('filters searched standards', () => {
    const state = {
      standards: {
        standardsFiltered: [2, 3],
      },
      collections: {
        standards: [
          { _id: 1, isDeleted: false },
          { _id: 2, isDeleted: false },
          { _id: 3, isDeleted: false },
        ],
      },
      global: {
        filter: STANDARD_FILTER_MAP.SECTION,
      },
    };
    const expectedStandards = state.collections.standards.slice(1);

    expect(getSearchedStandards(state)).toEqual(expectedStandards);
  });
});
