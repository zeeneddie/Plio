import { checkDocExistance } from '../../checkers';

export default (getQuery, collection) => (next, args, context) => {
  checkDocExistance(collection, getQuery(args, context));
  return next(args, context);
};
