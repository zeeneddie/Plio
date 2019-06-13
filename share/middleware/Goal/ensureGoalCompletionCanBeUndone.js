import invariant from 'invariant';

import { canGoalCompletionBeUndone } from '../../checkers';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  invariant(canGoalCompletionBeUndone(root, context.userId), Errors.DOC_CANNOT_UNDO_COMPLETION);

  return next(root, args, context);
};
