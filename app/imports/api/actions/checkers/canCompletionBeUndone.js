import { allPass, complement, flip, view, anyPass } from 'ramda';
import { isCompleted, isVerified } from 'plio-util/dist/lenses';
import { isCompletedAtDate, eqCompletedBy } from 'plio-util';

import isCompletedAtDeadlineDue from './isCompletedAtDeadlineDue';
import canCompleteAny from './canCompleteAny';

// (Object, String) => Boolean
export default allPass([
  view(isCompleted),
  complement(view(isVerified)),
  isCompletedAtDate,
  isCompletedAtDeadlineDue,
  anyPass([
    flip(eqCompletedBy),
    canCompleteAny,
  ]),
]);
