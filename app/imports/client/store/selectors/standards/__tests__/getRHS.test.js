import getRHS from '../getRHS';
import { getInitialState } from '../../../util/tests';

describe('getRHS', () => {
  it('matches snapshot', () => {
    const state = getInitialState({});

    expect(getRHS(state)).toMatchSnapshot();
  });
});
