import invariant from 'invariant';

import { isAnalysisOwner } from '../../checkers';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  invariant(await isAnalysisOwner(root, context.userId), Errors.ANALYSIS_NOT_AUTHORIZED);

  return next(root, args, context);
};
