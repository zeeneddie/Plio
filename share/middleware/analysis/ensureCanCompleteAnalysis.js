import invariant from 'invariant';

import { canCompleteAnalysis } from '../../checkers';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  const { userId, doc } = context;

  invariant(canCompleteAnalysis(doc, userId), Errors.ANALYSIS_CANT_COMPLETE);

  return next(root, args, context);
};
