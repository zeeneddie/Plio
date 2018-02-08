import { canCompletionBeUndone } from '../checkers';
import { ACT_COMPLETION_CANNOT_BE_UNDONE } from '../errors';

export default () => async (next, root, args, context) => {
  const { doc, userId } = context;

  if (!canCompletionBeUndone(doc, userId)) {
    throw ACT_COMPLETION_CANNOT_BE_UNDONE;
  }

  return next(root, args, context);
};
