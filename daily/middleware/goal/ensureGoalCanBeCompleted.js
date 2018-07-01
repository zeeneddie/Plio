import { canGoalBeCompleted } from '../../checkers';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  const { doc, userId } = context;

  if (!canGoalBeCompleted(doc, userId)) {
    throw new Error(Errors.DOC_CANNOT_BE_COMPLETED);
  }

  return next(root, args, context);
};
