import { drop } from 'ramda';

import getRisksDepartmentsList from '../getRisksDepartmentsList';
import { getInitialState } from '../../../util/tests';

describe('getRisksDepartmentsList', () => {
  it('matches snapshot', () => {
    const state = getInitialState({});
    const props = {
      risks: state.collections.risks,
    };

    expect(getRisksDepartmentsList(state, props)).toMatchSnapshot();
  });

  it('should correctly memoize', () => {
    const state = getInitialState({});
    let props = {
      risks: state.collections.risks,
    };
    getRisksDepartmentsList(state, props);
    getRisksDepartmentsList(state, props);
    expect(getRisksDepartmentsList.recomputations()).toBe(1);

    props = {
      risks: drop(1, props.risks),
    };

    getRisksDepartmentsList(state, props);
    expect(getRisksDepartmentsList.recomputations()).toBe(2);
  });
});
