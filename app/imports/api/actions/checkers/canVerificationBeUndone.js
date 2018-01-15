import { allPass, flip, view, anyPass } from 'ramda';
import { isVerified } from 'plio-util/dist/lenses';
import { isVerifiedAtDate, eqVerifiedBy } from 'plio-util';

import isVerifiedAtDeadlineDue from './isVerifiedAtDeadlineDue';
import canCompleteAny from './canCompleteAny';

export default allPass([
  view(isVerified),
  isVerifiedAtDate,
  isVerifiedAtDeadlineDue,
  anyPass([
    flip(eqVerifiedBy),
    canCompleteAny,
  ]),
]);

