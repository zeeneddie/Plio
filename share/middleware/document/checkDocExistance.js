import { curryN, is } from 'ramda';
import { checkDocExistance } from '../../checkers';

export default curryN(2, (getQuery, collection, { name = 'doc' } = {}) =>
  async (next, root, args, context) => {
    const col = is(Function, collection) ? await collection(root, args, context) : collection;
    const doc = await checkDocExistance(getQuery(args, context), col);
    return next(root, args, { ...context, [name]: doc });
  });
