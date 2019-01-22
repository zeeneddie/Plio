import invariant from 'invariant';

import { canGoalBeCompleted } from '../../checkers';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  invariant(canGoalBeCompleted(root, context.userId), Errors.DOC_CANNOT_BE_COMPLETED);

  return next(root, args, context);
};
