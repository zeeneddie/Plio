import { curryN } from 'ramda';
import { checkDocExistance } from '../../checkers';

export default curryN(2, (getQuery, collection, { name = 'doc' } = {}) =>
  async (next, root, args, context) => {
    const doc = await checkDocExistance(getQuery(args, context), collection);
    return next(root, args, { ...context, [name]: doc });
  });
