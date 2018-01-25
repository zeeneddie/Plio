import { ifElse } from 'ramda';

import { canCompletionBeUndone } from '../checkers';
import { ACT_COMPLETION_CANNOT_BE_UNDONE } from '../errors';

export default () => (next, args, context) => ifElse(
  (_, { userId, doc }) => canCompletionBeUndone(doc, userId),
  next,
  () => {
    throw ACT_COMPLETION_CANNOT_BE_UNDONE;
  },
)(args, context);
