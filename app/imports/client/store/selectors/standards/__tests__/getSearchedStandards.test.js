import getSearchedStandards from '../getSearchedStandards';
import { getInitialState } from '../../../util/tests';

describe('getSearchedStandards', () => {
  it('filters searched standards', () => {
    const state = getInitialState({
      standards: {
        standardsFiltered: [2, 3],
      },
      global: {
        searchText: 'hello world',
      },
    });
    const expectedStandards = [state.collections.standards[1]];

    expect(getSearchedStandards(state)).toEqual(expectedStandards);
  });

  it('returns passed standards when no search text entered', () => {
    const state = getInitialState({});

    expect(getSearchedStandards(state)).toEqual([
      state.collections.standards[0],
      state.collections.standards[1],
      state.collections.standards[4],
    ]);
  });
});
