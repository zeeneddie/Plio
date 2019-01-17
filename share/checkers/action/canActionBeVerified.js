import { allPass, complement, anyPass, flip, view } from 'ramda';
import { eqToBeVerifiedBy, lenses } from 'plio-util';

import canCompleteAnyAction from './canCompleteAnyAction';

const { isCompleted, isVerified } = lenses;

// (Object, String) => Boolean
export default allPass([
  view(isCompleted),
  complement(view(isVerified)),
  anyPass([
    flip(eqToBeVerifiedBy),
    canCompleteAnyAction,
  ]),
]);
