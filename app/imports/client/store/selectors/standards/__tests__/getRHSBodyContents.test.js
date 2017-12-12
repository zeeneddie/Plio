import getRHSBodyContents from '../getRHSBodyContents';
import { getInitialState } from '../../../util/tests';

describe('getRHSBodyContents', () => {
  it('matches snapshot', () => {
    const state = getInitialState({});
    const props = {
      sectionId: 8,
      typeId: 9,
      owner: 6,
      notify: [6],
      improvementPlan: {
        owner: 6,
      },
    };

    expect(getRHSBodyContents(props)(state)).toMatchSnapshot();
  });
});
