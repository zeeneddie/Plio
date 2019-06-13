import invariant from 'invariant';

import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  invariant(root.isCompleted, Errors.DOC_SHOULD_BE_COMPLETED);

  return next(root, args, context);
};
