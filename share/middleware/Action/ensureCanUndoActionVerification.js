import invariant from 'invariant';

import { canActionVerificationBeUndone } from '../../checkers';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  invariant(
    canActionVerificationBeUndone(root, context.userId),
    Errors.DOC_CANNOT_UNDO_VERIFICATION,
  );

  return next(root, args, context);
};
