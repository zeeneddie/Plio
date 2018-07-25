import invariant from 'invariant';

import { isAnalysisOwner } from '../../checkers';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  const { doc, userId } = context;

  invariant(await isAnalysisOwner(doc, userId), Errors.ANALYSIS_NOT_AUTHORIZED);

  return next(root, args, context);
};
