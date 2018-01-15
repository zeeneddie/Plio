import { allPass, complement, flip } from 'ramda';
import { isCompleted, isVerified } from 'plio-util/dist/lenses';
import { isCompletedAtDate, eqCompletedBy } from 'plio-util';

import isCompletedAtDeadlineDue from './isCompletedAtDeadlineDue';

export default allPass([
  isCompleted,
  complement(isVerified),
  isCompletedAtDate,
  flip(eqCompletedBy),
  isCompletedAtDeadlineDue,
]);
