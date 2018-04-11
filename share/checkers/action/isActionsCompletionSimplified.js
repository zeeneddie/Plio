import { allPass, contains, view, compose, nthArg, __, flip } from 'ramda';
import { eqCreatedBy, eqToBeCompletedBy, lenses, getType } from 'plio-util';

import { ActionTypes } from '../../constants';

// (action: Object, userId: String, organization: Object) => Boolean
export default allPass([
  compose(
    view(compose(
      lenses.workflowDefaults,
      lenses.isActionsCompletionSimplified,
    )),
    nthArg(2),
  ),
  compose(
    contains(__, [
      ActionTypes.CORRECTIVE_ACTION,
      ActionTypes.PREVENTATIVE_ACTION,
    ]),
    getType,
  ),
  flip(eqCreatedBy),
  flip(eqToBeCompletedBy),
]);
