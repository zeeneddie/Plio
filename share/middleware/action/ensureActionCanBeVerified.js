import { canActionBeVerified } from '../../checkers';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  const { doc, userId } = context;

  if (!canActionBeVerified(doc, userId)) {
    throw new Error(Errors.DOC_CANNOT_BE_VERIFIED);
  }

  return next(root, args, context);
};
