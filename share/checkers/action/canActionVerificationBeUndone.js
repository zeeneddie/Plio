import { allPass, flip, view, anyPass } from 'ramda';
import { isVerified } from 'plio-util/dist/lenses';
import { isVerifiedAtDate, eqVerifiedBy } from 'plio-util';

import isActionVerifiedAtDeadlineDue from './isActionVerifiedAtDeadlineDue';
import canCompleteAnyAction from './canCompleteAnyAction';

export default allPass([
  view(isVerified),
  isVerifiedAtDate,
  isActionVerifiedAtDeadlineDue,
  anyPass([
    flip(eqVerifiedBy),
    canCompleteAnyAction,
  ]),
]);

