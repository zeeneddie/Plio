import { sort } from 'ramda';
import { filterByType } from 'plio-util';

import { ProblemTypes } from '../../share/constants';

export const sortByType = sort((a, b) => {
  if (a.type === ProblemTypes.NON_CONFORMITY && b.type === ProblemTypes.POTENTIAL_GAIN) {
    return -1;
  } else if (a.type === ProblemTypes.POTENTIAL_GAIN && b.type === ProblemTypes.NON_CONFORMITY) {
    return 1;
  }
  return 0;
});
export const filterNCs = filterByType(ProblemTypes.NON_CONFORMITY);
export const filterPGs = filterByType(ProblemTypes.POTENTIAL_GAIN);
