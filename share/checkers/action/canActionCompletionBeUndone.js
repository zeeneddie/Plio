import { allPass, complement, flip, view, anyPass } from 'ramda';
import { isCompletedAtDate, eqCompletedBy, lenses } from 'plio-util';

import isActionCompletedAtDeadlineDue from './isActionCompletedAtDeadlineDue';
import canCompleteAnyAction from './canCompleteAnyAction';

const { isCompleted, isVerified } = lenses;

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
