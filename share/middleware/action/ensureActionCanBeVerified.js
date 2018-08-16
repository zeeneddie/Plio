import invariant from 'invariant';

import { canActionBeVerified } from '../../checkers';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  invariant(canActionBeVerified(root, context.userId), Errors.DOC_CANNOT_BE_VERIFIED);

  return next(root, args, context);
};
