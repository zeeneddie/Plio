import { allPass, complement, anyPass, flip, view } from 'ramda';
import { isCompleted, isVerified } from 'plio-util/dist/lenses';
import { eqToBeVerifiedBy } from 'plio-util';

import canCompleteAny from './canCompleteAny';

// (Object, String) => Boolean
export default allPass([
  view(isCompleted),
  complement(view(isVerified)),
  anyPass([
    flip(eqToBeVerifiedBy),
    canCompleteAny,
  ]),
]);
