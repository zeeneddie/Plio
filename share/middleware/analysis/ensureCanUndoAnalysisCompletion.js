import invariant from 'invariant';

import { canUndoAnalysisCompletion } from '../../checkers';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  const { userId, doc } = context;

  invariant(canUndoAnalysisCompletion(doc, userId), Errors.ANALYSIS_CANT_UNDO_COMPLETION);

  return next(root, args, context);
};
