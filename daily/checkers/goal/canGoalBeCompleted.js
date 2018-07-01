import { allPass, complement, view } from 'ramda';
import { lenses } from 'plio-util';

import { canCompleteAnyAction } from '../action';

// (Object, String) => Boolean
export default allPass([
  complement(view(lenses.isCompleted)),
  canCompleteAnyAction,
]);
