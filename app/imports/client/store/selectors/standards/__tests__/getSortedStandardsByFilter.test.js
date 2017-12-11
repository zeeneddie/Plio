import getSortedStandardsByFilter from '../getSortedStandardsByFilter';
import { STANDARD_FILTER_MAP } from '../../../../../api/constants';
import { getInitialState } from '../../../util/tests';

describe('getSortedStandardsByFilter', () => {
  it('sorts by title when is not deleted filter', () => {
    const state = getInitialState({
      standards: {
        standardsFiltered: [2, 3, 4, 5],
      },
      global: {
        searchText: 'Hello World',
      },
    });
    const expected = [state.collections.standards[1], state.collections.standards[4]];

    expect(getSortedStandardsByFilter(state)).toEqual(expected);
  });

  it('sorts by deletedAt when is deleted filter', () => {
    const state = getInitialState({
      standards: {
        standardsFiltered: [2, 3, 4, 5],
      },
      global: {
        filter: STANDARD_FILTER_MAP.DELETED,
        searchText: 'Hello World',
      },
    });
    const expected = [state.collections.standards[2], state.collections.standards[3]];

    expect(getSortedStandardsByFilter(state)).toEqual(expected);
  });
});
