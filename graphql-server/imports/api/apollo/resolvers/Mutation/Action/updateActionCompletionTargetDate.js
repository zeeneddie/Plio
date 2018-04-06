import { applyMiddleware, isCompleted } from 'plio-util';
import invariant from 'invariant';

import {
  checkLoggedIn,
  flattenInput,
  checkActionAccess,
  actionUpdateAfterware,
} from '../../../../../share/middleware';
import Errors from '../../../../../share/errors';

export const resolver = async (
  root,
  { _id, completionTargetDate },
  { services: { ActionService } },
) => ActionService.setCompletionDate({ _id, targetDate: completionTargetDate });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkActionAccess(),
  async (next, root, args, context) => {
    invariant(!isCompleted(context.doc), Errors.ACT_CANNOT_SET_COMPLETION_DATE_FOR_COMPLETED);

    return next(root, args, context);
  },
  actionUpdateAfterware(),
)(resolver);
