import { ifElse } from 'ramda';

import { canBeVerified } from '../checkers';
import { ACT_CANNOT_VERIFY } from '../errors';

export default () => (next, args, context) => ifElse(
  (_, { userId, doc }) => canBeVerified(doc, userId),
  next,
  () => {
    throw ACT_CANNOT_VERIFY;
  },
)(args, context);
