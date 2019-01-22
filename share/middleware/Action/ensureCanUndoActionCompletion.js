import invariant from 'invariant';

import { canActionCompletionBeUndone } from '../../checkers';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  invariant(canActionCompletionBeUndone(root, context.userId), Errors.DOC_CANNOT_UNDO_COMPLETION);

  return next(root, args, context);
};
