import { ifElse } from 'ramda';

import { canBeCompleted } from '../checkers';
import { ACT_CANNOT_COMPLETE } from '../errors';

export default () => (next, args, context) => ifElse(
  (_, { userId, doc }) => canBeCompleted(doc, userId),
  next,
  () => {
    throw ACT_CANNOT_COMPLETE;
  },
)(args, context);
