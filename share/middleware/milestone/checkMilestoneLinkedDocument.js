import { compose, nthArg, prop } from 'ramda';

import checkGoalAccess from '../goal/checkGoalAccess';
import Errors from '../../errors';

const getDoc = compose(prop('doc'), nthArg(2));

export default () => async (next, root, args, context) => {
  let goal;
  const { linkedTo } = args;

  try {
    goal = await checkGoalAccess()(getDoc, root, { _id: linkedTo }, context);
  } catch (err) {
    throw new Error(Errors.LINKED_DOC_NOT_FOUND);
  }

  return next(root, args, { ...context, goal });
};
