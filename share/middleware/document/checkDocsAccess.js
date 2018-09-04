import invariant from 'invariant';
import { noop } from 'plio-util';

import checkDocAccess from './checkDocAccess';

export default (config = () => ({})) => async (next, root, args, context) => {
  const {
    ids,
    queries,
    entities,
    ...configuration
  } = await config(root, args, context);

  invariant(ids || queries || entities, 'ids, queries or entities required');

  if (entities) {
    await Promise.all(entities.map(entity =>
      checkDocAccess(() => ({ ...configuration, entity }))(noop, root, args, context)));
  } else if (queries) {
    await Promise.all(queries.map(query =>
      checkDocAccess(() => ({ ...configuration, query }))(noop, root, args, context)));
  } else {
    await Promise.all(ids.map(_id =>
      checkDocAccess(() => ({ ...configuration, query: { _id } }))(noop, root, args, context)));
  }

  return next(root, args, context);
};
