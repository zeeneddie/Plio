import { allPass, view } from 'ramda';
import { isCompletedAtDate, lenses } from 'plio-util';

import {
  canCompleteAnyAction,
  isActionCompletedAtDeadlineDue,
} from '../action';

const { isCompleted } = lenses;

// (Object, String) => Boolean
export default allPass([
  view(isCompleted),
  isCompletedAtDate,
  isActionCompletedAtDeadlineDue,
  canCompleteAnyAction,
]);
