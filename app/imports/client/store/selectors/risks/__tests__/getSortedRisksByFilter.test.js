import { sort, compose, reverse } from 'ramda';
import { bySequentialId, byDeletedAt } from 'plio-util';

import getSortedRisksByFilter from '../getSortedRisksByFilter';
import { RiskFilterIndexes } from '../../../../../api/constants';
import { getInitialState } from '../../../util/tests';
import sortByTitlePrefix from '../../../../../api/helpers/sortByTitlePrefix';

describe('getSortedRisksByFilter', () => {
  it('sorts by title when is not deleted filter and no searchText entered', () => {
    const state = getInitialState({
      global: {
        searchText: '',
        filter: RiskFilterIndexes.TYPE,
      },
    });
    const expected = sortByTitlePrefix(state.collections.risks);

    expect(getSortedRisksByFilter(state)).toEqual(expected);
  });

  it('sorts by sequentialId when is not deleted filter and searchText is entered', () => {
    const state = getInitialState({
      global: {
        searchText: 'Hello World',
        filter: RiskFilterIndexes.TYPE,
      },
    });
    const expected = sort(bySequentialId, state.collections.risks);

    expect(getSortedRisksByFilter(state)).toEqual(expected);
  });

  it('sorts by sequentialId if is deleted filter and search text is entered', () => {
    const state = getInitialState({
      global: {
        searchText: 'Hello World',
        filter: RiskFilterIndexes.DELETED,
      },
    });
    const expected = sort(bySequentialId, state.collections.risks);

    expect(getSortedRisksByFilter(state)).toEqual(expected);
  });

  it('sorts by deletedAt and reverses if is deleted filter and no search text entered', () => {
    const state = getInitialState({
      global: {
        searchText: '',
        filter: RiskFilterIndexes.DELETED,
      },
    });
    const expected = compose(reverse, sort)(byDeletedAt, state.collections.risks);

    expect(getSortedRisksByFilter(state)).toEqual(expected);
  });
});
