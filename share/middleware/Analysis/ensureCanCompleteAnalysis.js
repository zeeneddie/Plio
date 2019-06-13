import invariant from 'invariant';

import { canCompleteAnalysis } from '../../checkers';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  invariant(canCompleteAnalysis(root, context.userId), Errors.ANALYSIS_CANT_COMPLETE);

  return next(root, args, context);
};
