import { allPass, flip } from 'ramda';
import { isVerified } from 'plio-util/dist/lenses';
import { isVerifiedAtDate, eqVerifiedBy } from 'plio-util';
import isVerifiedAtDeadlinePassed from './isVerifiedAtDeadlinePassed';

export default allPass([
  isVerified,
  isVerifiedAtDate,
  isVerifiedAtDeadlinePassed,
  flip(eqVerifiedBy),
]);

