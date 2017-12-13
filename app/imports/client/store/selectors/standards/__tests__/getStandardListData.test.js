import getStandardListData from '../getStandardListData';
import { getInitialState } from '../../../util/tests';

describe('getStandardListData', () => {
  it('matches snapshot', () => {
    const state = getInitialState({});

    expect(getStandardListData(state)).toMatchSnapshot();
  });
});
