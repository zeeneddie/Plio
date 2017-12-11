import getLHS from '../getLHS';
import { getInitialState } from '../../../util/tests/standards';

describe('getLHS', () => {
  it('matches snapshot', () => {
    const state = getInitialState({});

    expect(getLHS(state)).toMatchSnapshot();
  });
});
