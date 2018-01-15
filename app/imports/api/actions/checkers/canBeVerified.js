import { allPass, complement, anyPass, flip, view } from 'ramda';
import { isCompleted, isVerified } from 'plio-util/dist/lenses';
import { eqToBeVerifiedBy } from 'plio-util';

import hasRoleToComplete from './hasRoleToComplete';

// (Object, String) => Boolean
export default allPass([
  view(isCompleted),
  complement(view(isVerified)),
  anyPass([
    flip(eqToBeVerifiedBy),
    hasRoleToComplete,
  ]),
]);
