import { allPass, complement, flip, anyPass, view } from 'ramda';
import { eqToBeCompletedBy, lenses } from 'plio-util';

import canCompleteAnyAction from './canCompleteAnyAction';

const { isCompleted, isVerified } = lenses;

// (Object, String) => Boolean
export default allPass([
  complement(view(isCompleted)),
  complement(view(isVerified)),
  anyPass([
    flip(eqToBeCompletedBy),
    canCompleteAnyAction,
  ]),
]);
