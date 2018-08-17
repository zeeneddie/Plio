import { drop } from 'ramda';
import getTypesWithUncategorized from '../getTypesWithUncategorized';
import { getInitialState } from '../../../util/tests';

describe('getTypesWithUncategorized', () => {
  it('matches snapshot', () => {
    const state = getInitialState({});
    const props = {
      standards: state.collections.standards,
    };

    expect(getTypesWithUncategorized(state, props)).toMatchSnapshot();
  });

  it('should correctly memoize', () => {
    const state = getInitialState({});
    let props = {
      standards: state.collections.standards,
    };
    getTypesWithUncategorized(state, props);
    getTypesWithUncategorized(state, props);
    expect(getTypesWithUncategorized.recomputations()).toBe(1);

    props = {
      standards: drop(1, props.standards),
    };

    getTypesWithUncategorized(state, props);
    expect(getTypesWithUncategorized.recomputations()).toBe(2);
  });
});
