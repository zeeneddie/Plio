import invariant from 'invariant';

import { canUndoAnalysisCompletion } from '../../checkers';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  invariant(canUndoAnalysisCompletion(root, context.userId), Errors.ANALYSIS_CANT_UNDO_COMPLETION);

  return next(root, args, context);
};
