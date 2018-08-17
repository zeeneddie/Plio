import { canActionVerificationBeUndone } from '../../checkers';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  const { doc, userId } = context;

  if (!canActionVerificationBeUndone(doc, userId)) {
    throw new Error(Errors.DOC_CANNOT_UNDO_VERIFICATION);
  }

  return next(root, args, context);
};
