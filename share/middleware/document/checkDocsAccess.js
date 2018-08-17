import { compose, nthArg, prop } from 'ramda';

import checkDocAccess from './checkDocAccess';

const getDoc = compose(prop('doc'), nthArg(2));

export default ({ getIds, getCollection }) => async (next, root, args, context) => {
  const ids = await getIds(root, args, context);
  const docs = await Promise.all(ids.map(
    _id => checkDocAccess(getCollection)(getDoc, root, { _id }, context),
  ));

  return next(root, args, { ...context, docs });
};
