import invariant from 'invariant';

import { isAnalysisCompleted } from '../../checkers';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  invariant(!isAnalysisCompleted(root, context.userId), Errors.ANALYSIS_SHOULD_BE_INCOMPLETE);

  return next(root, args, context);
};
