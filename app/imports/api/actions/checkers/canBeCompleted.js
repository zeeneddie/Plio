import { allPass, complement, flip, anyPass, view } from 'ramda';
import { eqToBeCompletedBy } from 'plio-util';
import { isCompleted, isVerified } from 'plio-util/dist/lenses';

import hasRoleToComplete from './hasRoleToComplete';

// (Object, String) => Boolean
export default allPass([
  complement(view(isCompleted)),
  complement(view(isVerified)),
  anyPass([
    flip(eqToBeCompletedBy),
    hasRoleToComplete,
  ]),
]);
