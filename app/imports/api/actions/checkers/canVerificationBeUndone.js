import { allPass, flip } from 'ramda';
import { isVerified } from 'plio-util/dist/lenses';
import { isVerifiedAtDate, eqVerifiedBy } from 'plio-util';
import isVerifiedAtDeadlineDue from './isVerifiedAtDeadlineDue';

export default allPass([
  isVerified,
  isVerifiedAtDate,
  isVerifiedAtDeadlineDue,
  flip(eqVerifiedBy),
]);

