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
          { _id: 1 },
          { _id: 2 },
          { _id: 3 },
        ],
      },
      global: {
        filter: STANDARD_FILTER_MAP.SECTION,
        searchText: 'hello world',
      },
    };
    const expectedStandards = state.collections.standards.slice(1);

    expect(getSearchedStandards(state)).toEqual(expectedStandards);
  });

  it('returns passed standards when no search text entered', () => {
    const state = {
      standards: {
        standardsFiltered: [],
      },
      collections: {
        standards: [
          { _id: 1 },
          { _id: 2 },
          { _id: 3 },
        ],
      },
      global: {
        filter: STANDARD_FILTER_MAP.SECTION,
        searchText: '',
      },
    };

    expect(getSearchedStandards(state)).toEqual(state.collections.standards);
  });
});
