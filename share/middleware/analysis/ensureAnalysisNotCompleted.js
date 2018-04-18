import invariant from 'invariant';

import { isAnalysisCompleted } from '../../checkers';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  const { doc, userId } = context;

  invariant(!isAnalysisCompleted(doc, userId), Errors.ANALYSIS_SHOULD_BE_INCOMPLETE);

  return next(root, args, context);
};
