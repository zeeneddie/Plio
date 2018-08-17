import { drop } from 'ramda';
import getRiskTypesWithUncategorized from '../getRiskTypesWithUncategorized';
import { getInitialState } from '../../../util/tests';

describe('getRiskTypesWithUncategorized', () => {
  it('matches snapshot', () => {
    const state = getInitialState({});
    const props = {
      risks: state.collections.risks,
    };

    expect(getRiskTypesWithUncategorized(state, props)).toMatchSnapshot();
  });

  it('should correctly memoize', () => {
    const state = getInitialState({});
    let props = {
      risks: state.collections.risks,
    };
    getRiskTypesWithUncategorized(state, props);
    getRiskTypesWithUncategorized(state, props);
    expect(getRiskTypesWithUncategorized.recomputations()).toBe(1);

    props = {
      risks: drop(1, props.risks),
    };

    getRiskTypesWithUncategorized(state, props);
    expect(getRiskTypesWithUncategorized.recomputations()).toBe(2);
  });
});
