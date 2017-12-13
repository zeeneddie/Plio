import getSectionsWithUncategorized from '../getSectionsWithUncategorized';
import { getInitialState } from '../../../util/tests';


describe('getStandardSectionList', () => {
  it('matches snapshot', () => {
    const state = getInitialState({});
    const props = {
      standards: state.collections.standards,
    };

    expect(getSectionsWithUncategorized(state, props)).toMatchSnapshot();
  });
});
