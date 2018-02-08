import { canBeCompleted } from '../checkers';
import { ACT_CANNOT_COMPLETE } from '../errors';

export default () => async (next, root, args, context) => {
  const { doc, userId } = context;

  if (!canBeCompleted(doc, userId)) {
    throw ACT_CANNOT_COMPLETE;
  }

  return next(root, args, context);
};
