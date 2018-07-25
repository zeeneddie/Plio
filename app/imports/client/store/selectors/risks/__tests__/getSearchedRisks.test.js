import { findByIds } from 'plio-util';
import getSearchedRisks from '../getSearchedRisks';
import { getInitialState } from '../../../util/tests';

describe('getSearchedRisks', () => {
  it('filters searched risks', () => {
    const risksFiltered = [10, 14];
    const state = getInitialState({
      risks: {
        risksFiltered,
      },
      global: {
        searchText: 'hello world',
      },
    });
    const expected = findByIds(risksFiltered, state.collections.risks);

    expect(getSearchedRisks(state)).toEqual(expected);
  });

  it('returns passed risks when no search text entered', () => {
    const state = getInitialState({});
    const expected = state.collections.risks;

    expect(getSearchedRisks(state)).toEqual(expected);
  });
});
