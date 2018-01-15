import { allPass, complement, flip, anyPass } from 'ramda';
import { eqToBeCompletedBy } from 'plio-util';
import { isCompleted, isVerified } from 'plio-util/dist/lenses';

import hasRoleToComplete from './hasRoleToComplete';

// (action: Object, userId: String) => Boolean
export default allPass([
  complement(isCompleted),
  complement(isVerified),
  anyPass([
    flip(eqToBeCompletedBy),
    hasRoleToComplete,
  ]),
]);
