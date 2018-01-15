import { curry } from 'ramda';
import { checkDocExistance } from '../../checkers';

export default curry((getQuery, collection) => (next, args, context) => {
  const doc = checkDocExistance(collection, getQuery(args, context));
  return next(args, { ...context, doc });
});
