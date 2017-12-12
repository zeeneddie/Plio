import getStandardSectionList from '../getStandardSectionList';
import { getInitialState } from '../../../util/tests';


describe('getStandardSectionList', () => {
  it('matches snapshot', () => {
    const state = getInitialState({});
    const props = {
      standards: state.collections.standards,
    };

    expect(getStandardSectionList(state, props)).toMatchSnapshot();
  });
});
