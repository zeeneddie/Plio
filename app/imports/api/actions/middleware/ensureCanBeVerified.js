import { canBeVerified } from '../checkers';
import { ACT_CANNOT_VERIFY } from '../errors';

export default () => async (next, root, args, context) => {
  const { doc, userId } = context;

  if (!canBeVerified(doc, userId)) {
    throw ACT_CANNOT_VERIFY;
  }

  return next(root, args, context);
};
