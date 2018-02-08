import { canVerificationBeUndone } from '../checkers';
import { ACT_VERIFICATION_CANNOT_BE_UNDONE } from '../errors';

export default () => async (next, root, args, context) => {
  const { doc, userId } = context;

  if (!canVerificationBeUndone(doc, userId)) {
    throw ACT_VERIFICATION_CANNOT_BE_UNDONE;
  }

  return next(root, args, context);
};
