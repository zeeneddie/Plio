import { allPass, flip, view, anyPass } from 'ramda';
import { isVerifiedAtDate, eqVerifiedBy, lenses } from 'plio-util';

import isActionVerifiedAtDeadlineDue from './isActionVerifiedAtDeadlineDue';
import canCompleteAnyAction from './canCompleteAnyAction';

const { isVerified } = lenses;

export default allPass([
  view(isVerified),
  isVerifiedAtDate,
  isActionVerifiedAtDeadlineDue,
  anyPass([
    flip(eqVerifiedBy),
    canCompleteAnyAction,
  ]),
]);

