import { ifElse } from 'ramda';

import { canVerificationBeUndone } from '../checkers';
import { ACT_VERIFICATION_CANNOT_BE_UNDONE } from '../errors';

export default () => (next, args, context) => ifElse(
  (_, { userId, doc }) => canVerificationBeUndone(doc, userId),
  next,
  () => {
    throw ACT_VERIFICATION_CANNOT_BE_UNDONE;
  },
)(args, context);
