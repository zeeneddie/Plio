import { allPass, complement, anyPass, flip } from 'ramda';
import { isCompleted, isVerified } from 'plio-util/dist/lenses';
import { eqToBeVerifiedBy } from 'plio-util';

import hasRoleToComplete from './hasRoleToComplete';

export default allPass([
  isCompleted,
  complement(isVerified),
  anyPass([
    flip(eqToBeVerifiedBy),
    hasRoleToComplete,
  ]),
]);
