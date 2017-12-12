import getRHSHeaderButtons from '../getRHSHeaderButtons';
import { getInitialState } from '../../../util/tests';

jest.mock('../../../../../api/checkers/roles');
jest.mock('../../../../../api/checkers/membership');

describe('getRHSHeaderButtons', () => {
  it('matches snapshot', () => {
    const state = getInitialState({});

    expect(getRHSHeaderButtons(state)).toMatchSnapshot();
  });
});
