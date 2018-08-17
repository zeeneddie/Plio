import { flip, useWith, view, anyPass, identity } from 'ramda';
import { eqAnalysisCompletedBy, lenses } from 'plio-util';

import isOrgOwner from '../membership/isOrgOwner';

// ({ analysis: Object, organizationId: String }: Object, userId: String) => Boolean
export default anyPass([
  flip(eqAnalysisCompletedBy),
  useWith(isOrgOwner, [
    view(lenses.organizationId),
    identity,
  ]),
]);
