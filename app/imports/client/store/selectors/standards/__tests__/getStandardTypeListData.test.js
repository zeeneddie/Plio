import { drop } from 'ramda';
import getStandardTypeListData from '../getStandardTypeListData';
import { getInitialState } from '../../../util/tests';

describe('getStandardTypeListData', () => {
  it('matches snapshot', () => {
    const state = getInitialState({});
    const props = {
      standards: state.collections.standards,
    };

    expect(getStandardTypeListData(state, props)).toMatchSnapshot();
  });

  it('should correctly memoize', () => {
    const state = getInitialState({});
    let props = {
      standards: state.collections.standards,
    };
    getStandardTypeListData(state, props);
    getStandardTypeListData(state, props);
    expect(getStandardTypeListData.recomputations()).toBe(1);

    props = {
      standards: drop(1, props.standards),
    };

    getStandardTypeListData(state, props);
    expect(getStandardTypeListData.recomputations()).toBe(2);
  });
});
