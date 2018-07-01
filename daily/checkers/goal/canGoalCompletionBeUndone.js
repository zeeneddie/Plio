import { allPass, view } from 'ramda';
import { isCompleted } from 'plio-util/dist/lenses';
import { isCompletedAtDate } from 'plio-util';

import {
  canCompleteAnyAction,
  isActionCompletedAtDeadlineDue,
} from '../action';

// (Object, String) => Boolean
export default allPass([
  view(isCompleted),
  isCompletedAtDate,
  isActionCompletedAtDeadlineDue,
  canCompleteAnyAction,
]);
