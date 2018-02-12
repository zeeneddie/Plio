import { allPass, complement, flip, view, anyPass } from 'ramda';
import { isCompleted, isVerified } from 'plio-util/dist/lenses';
import { isCompletedAtDate, eqCompletedBy } from 'plio-util';

import isActionCompletedAtDeadlineDue from './isActionCompletedAtDeadlineDue';
import canCompleteAnyAction from './canCompleteAnyAction';

// (Object, String) => Boolean
export default allPass([
  view(isCompleted),
  complement(view(isVerified)),
  isCompletedAtDate,
  isActionCompletedAtDeadlineDue,
  anyPass([
    flip(eqCompletedBy),
    canCompleteAnyAction,
  ]),
]);
