import getRisksLinkedToStandard from '../getRisksLinkedToStandard';
import { getInitialState } from '../../../util/tests';

describe('getRisksLinkedToStandard', () => {
  it('matches snapshot', () => {
    const state = getInitialState({});
    const props = {
      standardId: 1,
    };
    const actual = getRisksLinkedToStandard(state, props);

    expect(actual).toHaveLength(3);
    expect(actual).toMatchSnapshot();
  });
});
